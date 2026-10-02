import fs from 'fs'
import path from 'path'
import { createFakeOrgUnitServer } from '../../../__fixtures__/fakeOrgUnitServer.js'
import { getCountableSources } from '../../../api/dataItemProfile/assignedOrgUnitCounts.js'
import { fetchOrgUnitCoverage } from '../../../api/dataItemProfile/fetchOrgUnitCoverage.js'
import { normalizeDataItemProfileMetadata } from '../../../api/dataItemProfile/metadataQueries.js'
import { getDataItemProfileOrgUnitCompatibility } from '../compatibility/getDataItemProfileOrgUnitCompatibility.js'
import { getDataItemProfile } from '../getDataItemProfile.js'

/* The fixtures come from the test tool in dhis2/maps-tools
 * (test-data-period-types, org unit groups): analytics' answers on 2.40 to
 * 2.44 for data sets and programs assigned at different levels, on the
 * tool's own org units. Each case is rebuilt here: its hierarchy and
 * assignments become a fake server, and the library judges the selection
 * from metadata as it would on a real one. */
const FIXTURES_DIR = path.join(__dirname, '../../../__fixtures__/org-units')

const readFixture = (name) =>
    JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, `${name}.json`)))

const CASE_GROUPS = [
    'entered-above',
    'partly-assigned',
    'mixed-levels',
    'aggregation-levels',
    'org-unit-groups',
    'user-org-units',
    'programs',
]

/* Where the tool's prediction differs from the library's on purpose (the
 * analytics answers agree with both) */
const PREDICTION_DIFFERENCES = {
    // One operand: the library gives the element's reason, OPERAND_PARTIAL is for expressions of several
    'ou-mixed-indicator__F1': {
        status: 'partial',
        reasons: ['ASSIGNED_AT_HIGHER_LEVEL'],
    },
}

// The tool's reason names, before the library renamed them
const REASON_BY_TOOL_NAME = {
    BELOW_COLLECTION: 'ASSIGNED_AT_HIGHER_LEVEL',
    AGGREGATION_LEVEL: 'STOPPED_BY_AGGREGATION_LEVEL',
    ORG_UNIT_FIELD: 'ANY_ORG_UNIT',
}

// Ids the library reads as org unit uids (11 characters)
const toUid = (prefix, key) => `${prefix}${key}xxxxxxxxxxx`.slice(0, 11)
const orgUnitUid = (key) => toUid('orgUnit', key)
const groupUid = (key) => toUid('groupOf', key)
const sourceUid = (name) =>
    toUid('src', name.replace(/[^a-zA-Z0-9]/g, '').slice(-8))

// The tool's root region sits under a level 1 org unit, as on the server
const ROOT = 'root'

const getPath = (key, orgUnits) =>
    key === ROOT
        ? `/${orgUnitUid(ROOT)}`
        : `${getPath(orgUnits[key].parent ?? ROOT, orgUnits)}/${orgUnitUid(
              key
          )}`

const getSources = ({ collectionSources = [], operands = [] }) => [
    ...collectionSources,
    ...operands.flatMap(getSources),
]

const createServer = (hierarchy, item) => {
    const sources = getSources(item)
    const assignedTo = (key, field) =>
        sources
            .filter((source) => source[field] && source.orgUnits.includes(key))
            .map((source) => sourceUid(source[field]))
    const orgUnits = Object.entries({
        [ROOT]: { level: 1 },
        ...hierarchy.orgUnits,
    }).map(([key, { level }]) => ({
        id: orgUnitUid(key),
        level,
        path: getPath(key, hierarchy.orgUnits),
        dataSets: assignedTo(key, 'dataSet'),
        programs: assignedTo(key, 'program'),
    }))
    const groups = Object.fromEntries(
        Object.entries(hierarchy.groups).map(([key, members]) => [
            groupUid(key),
            members.map(orgUnitUid),
        ])
    )
    const userOrgUnits = [orgUnitUid('region')]

    return createFakeOrgUnitServer({
        orgUnits,
        groups,
        user: {
            organisationUnits: userOrgUnits,
            dataViewOrganisationUnits: userOrgUnits,
        },
    })
}

const toDataElement = ({ aggregationType = 'SUM', collectionSources }) => ({
    aggregationType,
    ...(collectionSources.find(({ aggregationLevels }) => aggregationLevels)
        ?.aggregationLevels && {
        aggregationLevels: collectionSources.find(
            ({ aggregationLevels }) => aggregationLevels
        ).aggregationLevels,
    }),
    dataSetElements: collectionSources.map(({ dataSet, periodType }) => ({
        dataSet: { id: sourceUid(dataSet), periodType },
    })),
})

// An org unit data element's id, for a program indicator placed by one
const ORG_UNIT_DATA_ELEMENT = 'orgUnitDeAA'

// The metadata the library would fetch for the case's item
const getMetadata = (itemId, item) => {
    const [source] = item.collectionSources ?? []

    switch (item.dimensionItemType) {
        case 'INDICATOR':
            return normalizeDataItemProfileMetadata({
                indicators: [
                    {
                        id: itemId,
                        numerator: item.numerator,
                        denominator: item.denominator,
                    },
                ],
                dataElements: item.operands.map((operand) => ({
                    id: operand.id,
                    ...toDataElement(operand),
                })),
            })
        case 'PROGRAM_INDICATOR':
            return normalizeDataItemProfileMetadata({
                programIndicators: [
                    {
                        id: itemId,
                        program: { id: sourceUid(source.program) },
                        orgUnitField:
                            source.orgUnitField === 'DATA_ELEMENT'
                                ? ORG_UNIT_DATA_ELEMENT
                                : source.orgUnitField,
                    },
                ],
                programs: [{ id: sourceUid(source.program) }],
            })
        default:
            return normalizeDataItemProfileMetadata({
                dataElements: [{ id: itemId, ...toDataElement(item) }],
            })
    }
}

const toSelectionItem = (key, hierarchy) => {
    if (hierarchy.orgUnits[key]) {
        return orgUnitUid(key)
    }

    return key.startsWith('OU_GROUP-')
        ? `OU_GROUP-${groupUid(key.slice('OU_GROUP-'.length))}`
        : key
}

const judgeCase = async (hierarchy, { item, query }) => {
    const itemId = 'itemUnderTe'
    const profile = getDataItemProfile(
        { id: itemId, dimensionItemType: item.dimensionItemType },
        getMetadata(itemId, item)
    )
    const orgUnits = query.orgUnits.map((key) =>
        toSelectionItem(key, hierarchy)
    )
    const coverage = await fetchOrgUnitCoverage(
        createServer(hierarchy, item).createEngine(),
        { sources: getCountableSources([profile]), orgUnits }
    )

    return getDataItemProfileOrgUnitCompatibility(profile, {
        orgUnits,
        coverage,
    })[0]
}

const getExpected = ({ id, expected, observed }) => {
    if (PREDICTION_DIFFERENCES[id]) {
        return PREDICTION_DIFFERENCES[id]
    }

    const isRefused = Object.values(observed).every(({ error }) =>
        error?.startsWith('E7143')
    )

    return isRefused
        ? { status: 'none', reasons: ['EMPTY_GROUP'] }
        : {
              status: expected.compatibility,
              reasons: expected.reasons.map(
                  (reason) => REASON_BY_TOOL_NAME[reason] ?? reason
              ),
          }
}

/* What analytics must have returned on every version for the library's
 * status: none, nothing (or the refusal of an empty group); otherwise, never
 * an error. A full result says nothing is left out, not that there is data:
 * a program with no event in an org unit gives nothing there. */
const agreesWithAnalytics = ({ status, reasons }, observed) =>
    Object.values(observed).every((answer) => {
        if (reasons.includes('EMPTY_GROUP')) {
            return answer.status === 'ERROR'
        }

        return status === 'none'
            ? answer.status === 'EMPTY'
            : answer.status !== 'ERROR'
    })

describe('org unit fixtures', () => {
    describe.each(CASE_GROUPS)('%s', (group) => {
        const { hierarchy, cases } = readFixture(group)

        it.each(cases.map((fixtureCase) => [fixtureCase.id, fixtureCase]))(
            '%s: the library judges as the tool expects, and as analytics answered',
            async (_, fixtureCase) => {
                const result = await judgeCase(hierarchy, fixtureCase)

                /* PARTLY_ASSIGNED is informational: the tool leaves it out
                 * where the org unit has other children at that level */
                expect({
                    status: result.status,
                    reasons: result.reasons.filter(
                        (reason) =>
                            reason !== 'PARTLY_ASSIGNED' ||
                            fixtureCase.expected.reasons?.includes(reason)
                    ),
                }).toEqual(getExpected(fixtureCase))
                expect(agreesWithAnalytics(result, fixtureCase.observed)).toBe(
                    true
                )
            }
        )
    })

    describe('the metadata requests, as each version answered them', () => {
        const { findings } = readFixture('org-unit-requests')

        describe.each(Object.entries(findings))(
            '%s',
            (_, { metadataShapes }) => {
                const responseOf = (name) =>
                    metadataShapes.find((shape) => shape.name === name).response

                it('give data elements their aggregation levels', () => {
                    const { dataElements } = normalizeDataItemProfileMetadata({
                        dataElements: responseOf(
                            'dataElements-aggregationLevels'
                        ),
                    })

                    expect(
                        Object.values(dataElements).map(
                            ({ aggregationLevels }) => aggregationLevels
                        )
                    ).toContainEqual([2, 3])
                })

                it('give program indicators their program and orgUnitField', () => {
                    const { programIndicators } =
                        normalizeDataItemProfileMetadata({
                            programIndicators: responseOf('programIndicators'),
                        })
                    const indicators = Object.values(programIndicators)

                    expect(indicators.every(({ program }) => program)).toBe(
                        true
                    )
                    expect(
                        indicators.map(({ orgUnitField }) => orgUnitField)
                    ).toEqual(
                        expect.arrayContaining(['REGISTRATION', 'OWNER_AT_END'])
                    )
                })

                it('give the user data view org units', () => {
                    expect(
                        responseOf('me-ptt-user').dataViewOrganisationUnits
                    ).toHaveLength(1)
                })
            }
        )
    })
})
