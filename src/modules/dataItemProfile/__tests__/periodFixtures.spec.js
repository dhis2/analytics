import fs from 'fs'
import path from 'path'
import { inDataSets } from '../../../__fixtures__/dataItemProfileMetadata.js'
import { getDataItemProfile } from '../getDataItemProfile.js'
import { getDataItemProfileCompatibility } from '../getDataItemProfileCompatibility.js'
import { getYear } from '../periods/calendarDates.js'
import {
    getFirstOrLastValuePeriod,
    getYearsTouched,
} from '../periods/firstLastValues.js'
import {
    getFixedPeriodOfTypeByDate,
    getPeriodDates,
} from '../periods/periodRanges.js'
import { getPeriodTypeOfPeriodId } from '../periods/periodTypes.js'
import { getPeriodAggregationType } from '../profile/collectSources.js'

/* The fixtures come from the test tool in dhis2/maps-tools
 * (test-data-item-profile). PERIOD_TYPES_FIXTURES_DIR points the test at the
 * tool's full export; a folder in it holds one group split in parts. */
const FIXTURES_DIR =
    process.env.PERIOD_TYPES_FIXTURES_DIR ??
    path.join(__dirname, '../../../__fixtures__/period-types')

const readFixtures = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const entryPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
            return readFixtures(entryPath)
        }

        return entry.name.endsWith('.json') &&
            entry.name !== 'metadata-shapes.json'
            ? [JSON.parse(fs.readFileSync(entryPath, 'utf8'))]
            : []
    })

const LIBRARY_STATUS = {
    VALUE: 'full',
    REPEATED: 'full',
    EMPTY: 'none',
    PARTIAL: 'partial',
    // Analytics refuses the query: aggregation type NONE, or QuarterlyNov on 2.40
    ERROR: 'unknown',
}

const FIRST_OR_LAST_AGGREGATION =
    /^(FIRST|LAST)(_AVERAGE_ORG_UNIT|_FIRST_ORG_UNIT|_LAST_ORG_UNIT)?$/

const getItemParts = (item) => [item, ...(item.operands ?? [])]

const takesFirstOrLast = (item) =>
    getItemParts(item).some(({ aggregationType }) =>
        FIRST_OR_LAST_AGGREGATION.test(aggregationType)
    )

const hasReportingRate = (item) =>
    getItemParts(item).some(
        ({ dimensionItemType }) => dimensionItemType === 'REPORTING_RATE'
    )

/* What the library should answer, as a status and the reason it must give,
 * if any. The tool calls any value at a shorter period REPEATED; the library
 * tells apart:
 * - averaged values, repeated from the data period that holds the period:
 *   full, REPEATED_VALUE;
 * - the value FIRST and LAST take from an earlier data period: full,
 *   EARLIER_PERIOD_VALUE; when there is none, none, NO_EARLIER_PERIOD_VALUE;
 * - the meaningless value a reporting rate gives (0, or the expected reports
 *   count for another type of the same length): none,
 *   REPORTING_RATE_TOO_SHORT.
 * FIRST also takes earlier values in periods its data adds up into
 * (January's value for July), which the tool calls VALUE: any reason is
 * accepted there. */
const toExpected = ({ item }, { status }) => {
    if (status === 'REPEATED') {
        if (hasReportingRate(item)) {
            return { status: 'none', reason: 'REPORTING_RATE_TOO_SHORT' }
        }

        return takesFirstOrLast(item)
            ? { status: 'full', reason: 'EARLIER_PERIOD_VALUE' }
            : { status: 'full', reason: 'REPEATED_VALUE' }
    }

    if (status === 'EMPTY' && takesFirstOrLast(item)) {
        return { status: 'none', reason: 'NO_EARLIER_PERIOD_VALUE' }
    }

    return { status: LIBRARY_STATUS[status] }
}

const agrees = (expected, library) =>
    expected.status === library.status &&
    (!expected.reason || library.reasons.includes(expected.reason))

const describeExpected = ({ status, reason }) =>
    reason ? `${status} with ${reason}` : status

const describeLibrary = ({ status, reasons }) =>
    reasons.length ? `${status} [${reasons.join(', ')}]` : status

/* Cases the metadata can't see: the library's answer differs from what
 * analytics returns, on purpose, so they are not compared. The empty-result
 * check after Update is the way to find them. */
// The test data covers the periods of 2024 and 2025
const TEST_DATA_START = '2024-01-01'
const TEST_DATA_END = '2025-12-31'

// The periods asked in one request: the case's, and in the carry-windows group the other one of the pair
const getRequestPeriods = ({ query }) =>
    [query.period, query.withPeriod].filter(Boolean)

const isFirstOrLast = ({ aggregationType }) =>
    ['FIRST', 'LAST'].includes(getPeriodAggregationType(aggregationType))

/* The data period whose value the library says FIRST or LAST data takes for
 * the case's period, by the dates of the request's periods; null when none,
 * undefined when it doesn't apply. `fromYear` leaves out the years before it,
 * as when they hold no data. */
const predictFirstOrLastValuePeriod = (
    fixtureCase,
    { periodAggregationType, fromYear = -Infinity } = {}
) => {
    const { item, query } = fixtureCase
    const requestDates = getRequestPeriods(fixtureCase).map((period) =>
        getPeriodDates(period)
    )

    if (
        !isFirstOrLast(item) ||
        (item.collectionPeriodTypes ?? []).length !== 1 ||
        requestDates.includes(null)
    ) {
        return undefined
    }

    const years = [...new Set(requestDates.flatMap(getYearsTouched))].filter(
        (year) => year >= fromYear
    )

    return years.length
        ? getFirstOrLastValuePeriod({
              periodAggregationType:
                  periodAggregationType ??
                  getPeriodAggregationType(item.aggregationType),
              periodType: item.collectionPeriodTypes[0],
              dates: getPeriodDates(query.period),
              years,
          })
        : null
}

/* What analytics can answer when FIRST or LAST should take a period before
 * the test data: nothing, or (where it names the data period) the first one
 * with data among the years the request touches. That is the period holding
 * the start of the test data (it overlaps 2024, so it holds data), or the
 * first that counts in a year after it. Any other answer is compared, so a
 * wrong prediction fails. */
const answersWithoutEarlierData = (fixtureCase) => {
    const firstDataPeriods = [
        getFixedPeriodOfTypeByDate(
            fixtureCase.item.collectionPeriodTypes[0],
            TEST_DATA_START
        ),
        predictFirstOrLastValuePeriod(fixtureCase, {
            periodAggregationType: 'FIRST',
            fromYear: getYear(TEST_DATA_START),
        }),
    ].map((period) => period?.startDate)

    return getOutcomes(fixtureCase).every(([, { value, source }]) =>
        source
            ? firstDataPeriods.includes(getPeriodDates(source)?.startDate)
            : value === null || value === undefined
    )
}

const METADATA_BLIND_SPOTS = [
    {
        pattern: /^mixed-history__.*__r-2024/,
        reason: 'the metadata only shows the data sets of today',
    },
    {
        pattern: /^mixed-orphan__/,
        reason: 'without a data set, the metadata gives no period type',
    },
    {
        pattern: /^ind-period-offset__/,
        /* The test data starts with the periods that overlap 2024: the period
         * before one that starts by then has none */
        applies: ({ query }) =>
            getPeriodDates(query.period)?.startDate <= TEST_DATA_START,
        reason: 'periodOffset(-1) reads a period before the test data',
    },
    {
        pattern: /^(agg|carry-dense|carry-pair)-/,
        applies: (fixtureCase) => {
            const source = predictFirstOrLastValuePeriod(fixtureCase)

            return (
                Boolean(source) &&
                source.endDate < TEST_DATA_START &&
                answersWithoutEarlierData(fixtureCase)
            )
        },
        reason: 'FIRST or LAST takes a period before the test data',
    },
    {
        pattern: /^carry-sparse-/,
        reason: 'the library does not know which periods hold data',
        // Not in every subset: its patterns can all be dense ones
        optional: true,
    },
    {
        pattern: /^carry-/,
        applies: ({ query }) =>
            getPeriodDates(query.period)?.endDate < TEST_DATA_START,
        reason: 'the period ends before the test data',
    },
    {
        // Group 7 asks periods up to mid-2026
        pattern: /^carry-/,
        applies: ({ query }) =>
            getPeriodDates(query.period)?.endDate > TEST_DATA_END,
        reason: 'the period ends after the test data',
        // The smoke subset keeps none
        optional: true,
    },
]

const isBlindSpot = (fixtureCase) =>
    METADATA_BLIND_SPOTS.some(
        ({ pattern, applies = () => true }) =>
            pattern.test(fixtureCase.id) && applies(fixtureCase)
    )

// collectionSources is optional in the fixtures: one data set per period type otherwise
const getDataSets = ({ collectionSources, collectionPeriodTypes }) =>
    collectionSources
        ? collectionSources.map(({ dataSet, periodType }) => ({
              id: dataSet,
              periodType,
          }))
        : inDataSets(collectionPeriodTypes)

// Indicator operands need the id their expression uses
const addOperands = (metadata, operands = []) => {
    operands.forEach((operand) => {
        if (!operand.id) {
            throw new Error('an operand has no id')
        }

        if (operand.dimensionItemType === 'REPORTING_RATE') {
            metadata.dataSets[operand.id] = {
                periodType: operand.collectionPeriodTypes[0],
            }
        } else if (operand.dimensionItemType === 'INDICATOR') {
            metadata.indicators[operand.id] = {
                numerator: operand.numerator,
                denominator: operand.denominator,
            }
            addOperands(metadata, operand.operands)
        } else {
            metadata.dataElements[operand.id] = {
                aggregationType: operand.aggregationType,
                dataSets: getDataSets(operand),
            }
        }
    })
}

const toMetadata = ({ item }) => {
    const metadata = {
        dataElements: {},
        dataSets: {},
        indicators: {},
        expressionDimensionItems: {},
    }

    switch (item.dimensionItemType) {
        case 'REPORTING_RATE':
            metadata.dataSets.ds = { periodType: item.collectionPeriodTypes[0] }
            return { id: `ds.${item.metric ?? 'REPORTING_RATE'}`, metadata }
        case 'INDICATOR':
            metadata.indicators.item = {
                numerator: item.numerator,
                denominator: item.denominator,
            }
            addOperands(metadata, item.operands)
            return { id: 'item', metadata }
        case 'EXPRESSION_DIMENSION_ITEM':
            metadata.expressionDimensionItems.item = {
                expression: item.expression,
            }
            addOperands(metadata, item.operands)
            return { id: 'item', metadata }
        default:
            metadata.dataElements.de = {
                aggregationType: item.aggregationType,
                valueType: item.valueType,
                dataSets: getDataSets(item),
            }
            return { id: 'de', metadata }
    }
}

// What analytics returned on each version, or what is expected before a run
const getOutcomes = (fixtureCase) => {
    const observed = Object.entries(fixtureCase.observed ?? {})

    return observed.length ? observed : [['expected', fixtureCase.expected]]
}

// '2.40.12' or '2.43.3-SNAPSHOT' to { major, minor }
const toServerVersion = (version) => {
    const [major, minor] = version.split('.').map(Number)

    return Number.isInteger(minor) ? { major, minor } : undefined
}

// Ids the library reads as org unit uids (11 characters)
const toOrgUnitUid = (key) => `place${key}xxxxxxxxxxx`.slice(0, 11)

/* A case asked at an org unit, with its data sets assigned to some org units
 * (by place: monthly at A, weekly at B): a coverage of those org units at
 * level 2, under the one asked when it isn't one of them (the region) */
const getPlaceCoverage = ({ item, query }) => {
    const sources = item.collectionSources ?? []

    if (!query.orgUnit || !sources.some(({ orgUnits }) => orgUnits)) {
        return null
    }

    const keys = [...new Set(sources.flatMap(({ orgUnits = [] }) => orgUnits))]
    const parentKey = keys.includes(query.orgUnit) ? 'Root' : query.orgUnit
    const parent = {
        id: toOrgUnitUid(parentKey),
        level: 1,
        path: `/${toOrgUnitUid(parentKey)}`,
    }
    const assignedAmong = (dataSetKeys, orgUnits) =>
        dataSetKeys.filter((key) => orgUnits.includes(key)).length
    const countsOf = (unitKeys) => ({
        totals: { 2: unitKeys.length },
        sources: Object.fromEntries(
            sources.map(({ dataSet, orgUnits = [] }) => [
                dataSet,
                { byLevel: { 2: assignedAmong(unitKeys, orgUnits) } },
            ])
        ),
    })

    return {
        levels: [{ level: 1 }, { level: 2 }],
        orgUnits: {
            [parent.id]: parent,
            ...Object.fromEntries(
                keys.map((key) => [
                    toOrgUnitUid(key),
                    {
                        id: toOrgUnitUid(key),
                        level: 2,
                        path: `${parent.path}/${toOrgUnitUid(key)}`,
                    },
                ])
            ),
        },
        counts: {
            [parent.id]: countsOf(keys),
            ...Object.fromEntries(
                keys.map((key) => [toOrgUnitUid(key), countsOf([key])])
            ),
        },
    }
}

const computeLibraryAnswer = (fixtureCase, serverVersion) => {
    const { id, metadata } = toMetadata(fixtureCase)
    const profile = getDataItemProfile(
        { id, dimensionItemType: fixtureCase.item.dimensionItemType },
        metadata
    )
    const { period, periodType } = fixtureCase.query
    /* `period` is a period of the query type, or the range the query type is
     * asked over (the weeks of 2025Q2) */
    const asked =
        getPeriodTypeOfPeriodId(period) === periodType ? period : periodType

    const { withPeriod } = fixtureCase.query
    const placeCoverage = getPlaceCoverage(fixtureCase)

    // Asked at an org unit: the period judged there, with only the data sets assigned to it
    if (placeCoverage) {
        const { status, reasons } = getDataItemProfileCompatibility(
            profile,
            {
                periods: [asked],
                orgUnits: [toOrgUnitUid(fixtureCase.query.orgUnit)],
            },
            { serverVersion, orgUnitCoverage: placeCoverage }
        )

        return { status, reasons }
    }

    const { periods } = getDataItemProfileCompatibility(
        profile,
        { periods: withPeriod ? [asked, withPeriod] : [asked] },
        { serverVersion }
    )
    const { status, reasons } = periods[0]

    return { status, reasons }
}

/* The versions only differ for QuarterlyNov, which 2.40 can't answer: one
 * answer for 2.40, one for the others */
const libraryAnswers = new Map()

const getLibraryAnswer = (fixtureCase, version) => {
    const serverVersion = toServerVersion(version)
    const key = `${fixtureCase.id}:${serverVersion?.minor < 41}`

    if (!libraryAnswers.has(key)) {
        libraryAnswers.set(
            key,
            computeLibraryAnswer(fixtureCase, serverVersion)
        )
    }

    return libraryAnswers.get(key)
}

/* A case the metadata check can't read: a request without a period type
 * (the detection requests, for the after-Update check), or operands without
 * ids */
const canRead = (fixtureCase) => {
    try {
        return (
            Boolean(fixtureCase.item?.dimensionItemType) &&
            Boolean(fixtureCase.query?.periodType) &&
            toMetadata(fixtureCase)
        )
    } catch {
        return false
    }
}

const describeCase = ({ item, query }) =>
    [
        item.dimensionItemType,
        item.aggregationType ?? item.metric,
        (item.collectionPeriodTypes ?? []).join('+'),
        `q ${query.periodType}`,
    ].join(' ')

/* One line per pattern, not per case: the full export has hundreds of
 * thousands of outcomes */
const summarize = (mismatches) =>
    Object.values(
        mismatches.reduce((patterns, mismatch) => {
            const key = `${describeCase(mismatch.fixtureCase)}: analytics ${
                mismatch.status
            } (${describeExpected(
                mismatch.expected
            )}), library ${describeLibrary(mismatch.library)}`
            const pattern = patterns[key] ?? { key, count: 0, example: '' }

            pattern.count++
            pattern.example ||= `${mismatch.fixtureCase.id} (${mismatch.version})`
            patterns[key] = pattern

            return patterns
        }, {})
    ).map(({ key, count, example }) => `${count}× ${key}, e.g. ${example}`)

const fixtures = readFixtures(FIXTURES_DIR)
const allCases = fixtures.flatMap(({ cases }) => cases)
const casesOf = (group) =>
    fixtures
        .filter((fixture) => fixture.group === group)
        .flatMap((fixture) => fixture.cases)
const allGroups = [...new Set(fixtures.map(({ group }) => group))]
// The detection requests are for the after-Update check: nothing to compare here
const NOT_COMPARED_GROUPS = ['detection-requests']
const groups = allGroups.filter((group) => !NOT_COMPARED_GROUPS.includes(group))

describe('period type fixtures', () => {
    it('are there', () => {
        expect(allCases.length).toBeGreaterThan(0)
    })

    it('use only statuses the library maps', () => {
        const statuses = allCases.flatMap((fixtureCase) =>
            getOutcomes(fixtureCase).map(([, { status }]) => status)
        )

        expect(
            [...new Set(statuses)].filter(
                (status) => !(status in LIBRARY_STATUS)
            )
        ).toEqual([])
    })

    it('list only blind spots that exist', () => {
        expect(
            METADATA_BLIND_SPOTS.filter(
                ({ pattern, applies = () => true, optional }) =>
                    !optional &&
                    !allCases.some(
                        (fixtureCase) =>
                            pattern.test(fixtureCase.id) && applies(fixtureCase)
                    )
            ).map(({ reason }) => reason)
        ).toEqual([])
    })

    /* The carry-windows group names the data period each FIRST or LAST value
     * comes from. Where every period holds data (the dense layout), the
     * library must pick the same one. */
    it('pick the data period analytics names for FIRST and LAST', () => {
        const cases = allCases.filter(
            (fixtureCase) =>
                fixtureCase.id.startsWith('carry-') &&
                !isBlindSpot(fixtureCase) &&
                predictFirstOrLastValuePeriod(fixtureCase) !== undefined
        )
        const startOf = (period) =>
            period ? getPeriodDates(period)?.startDate ?? period : null
        const mismatches = cases.flatMap((fixtureCase) => {
            const predicted =
                predictFirstOrLastValuePeriod(fixtureCase)?.startDate ?? null

            return getOutcomes(fixtureCase)
                .filter(([, { source }]) => startOf(source) !== predicted)
                .map(
                    ([version, { source }]) =>
                        `${fixtureCase.id} (${version}): analytics ${source}, library ${predicted}`
                )
        })

        expect(cases.length).toBeGreaterThan(0)
        expect(mismatches.slice(0, 20)).toEqual([])
    })

    it('leave out only the groups the metadata check can’t read', () => {
        expect(
            allGroups.filter((group) => !casesOf(group).some(canRead))
        ).toEqual(NOT_COMPARED_GROUPS)
    })

    it.each(groups)('%s: the library agrees with analytics', (group) => {
        const cases = casesOf(group).filter(
            (fixtureCase) => canRead(fixtureCase) && !isBlindSpot(fixtureCase)
        )

        expect(cases.length).toBeGreaterThan(0)
        const mismatches = cases.flatMap((fixtureCase) =>
            getOutcomes(fixtureCase)
                .map(([version, outcome]) => ({
                    fixtureCase,
                    version,
                    status: outcome.status,
                    expected: toExpected(fixtureCase, outcome),
                    library: getLibraryAnswer(fixtureCase, version),
                }))
                .filter(({ expected, library }) => !agrees(expected, library))
        )

        expect(summarize(mismatches)).toEqual([])
    })
})
