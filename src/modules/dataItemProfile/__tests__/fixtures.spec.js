import fs from 'fs'
import path from 'path'
import { inDataSets } from '../../../__fixtures__/dataItemProfileMetadata.js'
import { getCarriedSource, getYearsTouched } from '../carriedValues.js'
import {
    getDataItemProfile,
    getPeriodAggregationType,
} from '../getDataItemProfile.js'
import { getDataItemProfileCompatibility } from '../getDataItemProfileCompatibility.js'
import { getPeriodDates } from '../periodTypeRelations.js'
import { getPeriodTypeOfPeriodId } from '../periodTypes.js'

/* The fixtures come from the test tool in dhis2/maps-tools
 * (test-data-period-types). PERIOD_TYPES_FIXTURES_DIR points the test at the
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

const CARRYING =
    /^(FIRST|LAST)(_AVERAGE_ORG_UNIT|_FIRST_ORG_UNIT|_LAST_ORG_UNIT)?$/

const getItemParts = (item) => [item, ...(item.operands ?? [])]

const isCarrying = (item) =>
    getItemParts(item).some(({ aggregationType }) =>
        CARRYING.test(aggregationType)
    )

const hasReportingRate = (item) =>
    getItemParts(item).some(
        ({ dimensionItemType }) => dimensionItemType === 'REPORTING_RATE'
    )

/* What the library should answer, as a status and the reason it must give,
 * if any. The tool calls any value at a shorter period REPEATED; the library
 * tells apart:
 * - averaged values, repeated from the data period that holds the period:
 *   complete, AVERAGED;
 * - the value FIRST and LAST carry from an earlier data period: complete,
 *   CARRIED; when nothing is carried, empty, NOTHING_TO_CARRY;
 * - the meaningless value a reporting rate gives (0, or the expected reports
 *   count for another type of the same length): empty, REPORTING_RATE.
 * FIRST also carries into periods its data adds up into (January's value for
 * July), which the tool calls VALUE: any reason is accepted there. */
const toExpected = ({ item }, { status }) => {
    if (status === 'REPEATED') {
        if (hasReportingRate(item)) {
            return { status: 'none', reason: 'REPORTING_RATE' }
        }

        return isCarrying(item)
            ? { status: 'full', reason: 'CARRIED' }
            : { status: 'full', reason: 'AVERAGED' }
    }

    if (status === 'EMPTY' && isCarrying(item)) {
        return { status: 'none', reason: 'NOTHING_TO_CARRY' }
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
 * analytics returns, on purpose, so they are not compared. Capability 4 (the
 * collected period types) is the way to find them. */
const TEST_DATA_START = '2024-01-01'

// The periods asked in one request: the case's, and another one in group 7
const getRequestPeriods = ({ query }) =>
    [query.period, query.withPeriod].filter(Boolean)

const isFirstOrLast = ({ aggregationType }) =>
    ['FIRST', 'LAST'].includes(getPeriodAggregationType(aggregationType))

/* The data period the library says FIRST or LAST data carries into the case's
 * period, by the dates of the request's periods; null when none, undefined
 * when it doesn't apply */
const predictCarriedSource = (fixtureCase) => {
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

    return getCarriedSource({
        periodAggregationType: getPeriodAggregationType(item.aggregationType),
        periodType: item.collectionPeriodTypes[0],
        dates: getPeriodDates(query.period),
        years: [...new Set(requestDates.flatMap(getYearsTouched))],
    })
}

const METADATA_BLIND_SPOTS = [
    {
        pattern: /^mixed-place__.*__(A|B)$/,
        reason: 'the library does not read which org units a data set is assigned to',
    },
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
            const source = predictCarriedSource(fixtureCase)

            return Boolean(source) && source.endDate < TEST_DATA_START
        },
        reason: 'FIRST or LAST carries a period before the test data',
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
]

const isBlindSpot = (fixtureCase) =>
    METADATA_BLIND_SPOTS.some(
        ({ pattern, applies = () => true }) =>
            pattern.test(fixtureCase.id) && applies(fixtureCase)
    )

// collectionSources is optional (Addendum 1): one data set per period type otherwise
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

/* A case the library can't read yet: a request without a period type
 * (detection requests), or operands without ids */
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
const groups = [...new Set(fixtures.map(({ group }) => group))]
const allCases = fixtures.flatMap(({ cases }) => cases)

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

    /* Group 7 names the data period each value comes from. Where every period
     * holds data (the dense layout), the library must pick the same one. */
    it('carry the data period analytics names', () => {
        const cases = allCases.filter(
            (fixtureCase) =>
                fixtureCase.id.startsWith('carry-') &&
                !isBlindSpot(fixtureCase) &&
                predictCarriedSource(fixtureCase) !== undefined
        )
        const startOf = (period) =>
            period ? getPeriodDates(period)?.startDate ?? period : null
        const mismatches = cases.flatMap((fixtureCase) => {
            const predicted =
                predictCarriedSource(fixtureCase)?.startDate ?? null

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

    it.each(groups)('%s: the library agrees with analytics', (group) => {
        const cases = fixtures
            .filter((fixture) => fixture.group === group)
            .flatMap((fixture) => fixture.cases)
            .filter(
                (fixtureCase) =>
                    canRead(fixtureCase) && !isBlindSpot(fixtureCase)
            )
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
