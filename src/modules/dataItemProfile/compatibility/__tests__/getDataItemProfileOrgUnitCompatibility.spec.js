import { inDataSets } from '../../../../__fixtures__/dataItemProfileMetadata.js'
import { getDataItemProfile } from '../../getDataItemProfile.js'
import { getDataItemProfileCompatibility } from '../../getDataItemProfileCompatibility.js'
import { getDataItemProfileOrgUnitCompatibility } from '../getDataItemProfileOrgUnitCompatibility.js'

const METADATA = {
    dataElements: {
        facility: {
            aggregationType: 'SUM',
            dataSets: inDataSets(['Monthly']),
        },
        district: {
            aggregationType: 'SUM',
            dataSets: inDataSets(['Quarterly']),
        },
        twoForms: {
            aggregationType: 'SUM',
            dataSets: inDataSets(['Monthly', 'Weekly']),
        },
        twoLevels: {
            aggregationType: 'SUM',
            dataSets: inDataSets(['Monthly', 'Quarterly']),
        },
        cappedAtDistrict: {
            aggregationType: 'SUM',
            dataSets: inDataSets(['Monthly']),
            aggregationLevels: [2],
        },
        cappedWithDistrictForm: {
            aggregationType: 'SUM',
            dataSets: inDataSets(['Monthly', 'Quarterly']),
            aggregationLevels: [2],
        },
        orphan: { aggregationType: 'SUM', dataSets: [] },
    },
    dataSets: { MonthlyForm: { periodType: 'Monthly' } },
    programs: { eventProgra: { programType: 'WITHOUT_REGISTRATION' } },
    programIndicators: {
        pi: { program: 'eventProgra' },
        piByOwner: { program: 'eventProgra', orgUnitField: 'OWNER_AT_END' },
        piByRegistr: { program: 'eventProgra', orgUnitField: 'REGISTRATION' },
        piByAttribu: { program: 'eventProgra', orgUnitField: 'attributeAAA' },
    },
    indicators: {
        ratio: { numerator: '#{facility}', denominator: '#{district}' },
        completeness: {
            numerator: '#{facility}',
            denominator: 'R{MonthlyForm.REPORTING_RATE}',
        },
        partOfTotal: { numerator: '#{twoLevels}', denominator: '#{facility}' },
        casesPerFacility: { numerator: 'I{pi}', denominator: '#{facility}' },
        constantsOnly: { numerator: 'C{constantAA}', denominator: '[days]' },
    },
}

const profileOf = (id, dimensionItemType = 'DATA_ELEMENT') =>
    getDataItemProfile({ id, dimensionItemType }, METADATA)

/* A nation (level 1) with 2 districts (2) and 4 facilities (3).
 * MonthlyForm: 3 of the 4 facilities (missing facilityDDD, under districtBBB),
 * and the nation. QuarterlyForm: both districts. WeeklyForm: facilityDDD. */
const unit = (id, level, path) => ({ id, level, path })
const COVERAGE = {
    levels: [
        { id: 'levelNation', level: 1 },
        { id: 'levelDistri', level: 2 },
        { id: 'levelFacili', level: 3 },
    ],
    orgUnits: {
        nationUnit1: unit('nationUnit1', 1, '/nationUnit1'),
        districtAAA: unit('districtAAA', 2, '/nationUnit1/districtAAA'),
        districtBBB: unit('districtBBB', 2, '/nationUnit1/districtBBB'),
        facilityAAA: unit(
            'facilityAAA',
            3,
            '/nationUnit1/districtAAA/facilityAAA'
        ),
        facilityDDD: unit(
            'facilityDDD',
            3,
            '/nationUnit1/districtBBB/facilityDDD'
        ),
    },
    rootIds: ['nationUnit1'],
    userOrgUnitIds: ['districtBBB'],
    // clinicGroup: facilityAAA and facilityDDD. mixedGroupA: districtBBB and facilityAAA
    groups: {
        clinicGroup: { 3: 2 },
        mixedGroupA: { 2: 1, 3: 1 },
        emptyGroupA: {},
    },
    assignedOrgUnitCounts: {
        MonthlyForm: { 1: 1, 3: 3 },
        QuarterlyForm: { 2: 2 },
        WeeklyForm: { 3: 1 },
        eventProgra: { 3: 2 },
    },
    counts: {
        nationUnit1: {
            totals: { 1: 1, 2: 2, 3: 4 },
            sources: {
                MonthlyForm: { byLevel: { 1: 1, 3: 3 } },
                QuarterlyForm: { byLevel: { 2: 2 } },
                WeeklyForm: { byLevel: { 3: 1 } },
                eventProgra: { byLevel: { 3: 2 } },
            },
        },
        districtAAA: {
            totals: { 2: 1, 3: 2 },
            sources: {
                MonthlyForm: { byLevel: { 3: 2 }, ancestors: 1 },
                QuarterlyForm: { byLevel: { 2: 1 } },
                WeeklyForm: { byLevel: {} },
            },
        },
        districtBBB: {
            totals: { 2: 1, 3: 2 },
            sources: {
                MonthlyForm: { byLevel: { 3: 1 }, ancestors: 1 },
                QuarterlyForm: { byLevel: { 2: 1 } },
                WeeklyForm: { byLevel: { 3: 1 } },
            },
        },
        facilityAAA: {
            totals: { 3: 1 },
            sources: {
                MonthlyForm: { byLevel: { 3: 1 }, ancestors: 1 },
                QuarterlyForm: { byLevel: {}, ancestors: 1 },
            },
        },
        facilityDDD: {
            totals: { 3: 1 },
            sources: {
                eventProgra: { byLevel: {} },
                MonthlyForm: { byLevel: {}, ancestors: 1 },
                QuarterlyForm: { byLevel: {}, ancestors: 1 },
                WeeklyForm: { byLevel: { 3: 1 } },
            },
        },
        'clinicGroup:3:': {
            totals: { 3: 2 },
            sources: {
                MonthlyForm: { byLevel: { 3: 1 }, ancestors: 1 },
                QuarterlyForm: { byLevel: {}, ancestors: 2 },
            },
        },
        'mixedGroupA:2:': {
            totals: { 2: 1, 3: 2 },
            sources: { MonthlyForm: { byLevel: { 3: 1 }, ancestors: 1 } },
        },
        'mixedGroupA:3:': {
            totals: { 3: 1 },
            sources: { MonthlyForm: { byLevel: { 3: 1 }, ancestors: 1 } },
        },
        'mixedGroupA:2:districtAAA': {
            totals: { 2: 0, 3: 0 },
            sources: { MonthlyForm: { byLevel: { 3: 0 }, ancestors: 1 } },
        },
        'mixedGroupA:3:districtAAA': {
            totals: { 3: 1 },
            sources: { MonthlyForm: { byLevel: { 3: 1 }, ancestors: 1 } },
        },
    },
}

const judge = (id, orgUnits, { type, coverage = COVERAGE } = {}) =>
    getDataItemProfileOrgUnitCompatibility(profileOf(id, type), {
        orgUnits,
        coverage,
    })

describe('getDataItemProfileOrgUnitCompatibility', () => {
    it('is full where every org unit at the deepest level assigned is', () => {
        expect(judge('facility', ['districtAAA'])).toEqual([
            {
                id: 'districtAAA',
                status: 'full',
                reasons: [],
                assignment: { assigned: 2, total: 2, level: 3 },
            },
        ])
    })

    it('is full where only some are, since the others collect nothing', () => {
        expect(judge('facility', ['nationUnit1'])).toEqual([
            {
                id: 'nationUnit1',
                status: 'full',
                reasons: ['PARTLY_ASSIGNED'],
                assignment: { assigned: 3, total: 4, level: 3 },
            },
        ])
    })

    it('is none at an org unit not assigned, though assigned at its level elsewhere', () => {
        expect(judge('facility', ['facilityDDD'])).toMatchObject([
            { status: 'none', reasons: ['NOT_ASSIGNED'], assignment: null },
        ])
    })

    it('is none below the levels it is assigned at', () => {
        expect(judge('district', ['facilityAAA'])).toMatchObject([
            { status: 'none', reasons: ['ASSIGNED_AT_HIGHER_LEVEL'] },
        ])
        expect(judge('district', ['nationUnit1', 'LEVEL-3'])).toMatchObject([
            {
                id: 'LEVEL-3',
                status: 'none',
                reasons: ['ASSIGNED_AT_HIGHER_LEVEL'],
            },
        ])
    })

    it('counts an element where any of its data sets is assigned', () => {
        expect(judge('twoForms', ['facilityDDD'])).toMatchObject([
            { status: 'full' },
        ])
        expect(judge('twoForms', ['nationUnit1'])).toMatchObject([
            {
                status: 'full',
                reasons: ['PARTLY_ASSIGNED'],
                assignment: { assigned: 3, total: 4 },
            },
        ])
    })

    it('is partial when another data set is assigned at a higher level: its values are left out', () => {
        expect(judge('twoLevels', ['facilityAAA'])).toEqual([
            {
                id: 'facilityAAA',
                status: 'partial',
                reasons: ['ASSIGNED_AT_HIGHER_LEVEL'],
                assignment: { assigned: 1, total: 1, level: 3 },
            },
        ])
    })

    it('needs every operand of an expression', () => {
        expect(
            judge('ratio', ['facilityAAA'], { type: 'INDICATOR' })
        ).toMatchObject([
            {
                status: 'none',
                reasons: ['OPERAND_EMPTY', 'ASSIGNED_AT_HIGHER_LEVEL'],
            },
        ])
        expect(
            judge('MonthlyForm.REPORTING_RATE', ['districtAAA'], {
                type: 'REPORTING_RATE',
            })
        ).toMatchObject([{ status: 'full' }])
        expect(
            judge('completeness', ['facilityDDD'], { type: 'INDICATOR' })
        ).toMatchObject([
            { status: 'none', reasons: ['OPERAND_EMPTY', 'NOT_ASSIGNED'] },
        ])
    })

    it('says an expression is computed from a partial operand', () => {
        expect(
            judge('partOfTotal', ['facilityAAA'], { type: 'INDICATOR' })
        ).toMatchObject([
            {
                status: 'partial',
                reasons: ['OPERAND_PARTIAL', 'ASSIGNED_AT_HIGHER_LEVEL'],
            },
        ])
    })

    it('stops values below an aggregation level from reaching it', () => {
        expect(judge('cappedAtDistrict', ['districtAAA'])).toEqual([
            {
                id: 'districtAAA',
                status: 'none',
                reasons: ['STOPPED_BY_AGGREGATION_LEVEL'],
                assignment: null,
            },
        ])
        expect(judge('cappedAtDistrict', ['facilityAAA'])).toMatchObject([
            { status: 'full', reasons: [] },
        ])
    })

    it('counts values from the aggregation level or above it', () => {
        expect(judge('cappedAtDistrict', ['nationUnit1'])).toMatchObject([
            {
                status: 'full',
                assignment: { assigned: 1, total: 1, level: 1 },
            },
        ])
    })

    it('is partial when the values of one data set are stopped', () => {
        expect(judge('cappedWithDistrictForm', ['districtAAA'])).toMatchObject([
            { status: 'partial', reasons: ['STOPPED_BY_AGGREGATION_LEVEL'] },
        ])
    })

    it('judges a level under parent org units, adding up their counts', () => {
        expect(
            judge('facility', ['districtAAA', 'districtBBB', 'LEVEL-3'])
        ).toEqual([
            {
                id: 'LEVEL-3',
                status: 'full',
                reasons: ['PARTLY_ASSIGNED'],
                assignment: { assigned: 3, total: 4, level: 3 },
            },
        ])
    })

    it('judges a level under the roots, and the user org units', () => {
        expect(judge('district', ['LEVEL-2'])).toMatchObject([
            { status: 'full', assignment: { assigned: 2, total: 2 } },
        ])
        expect(judge('facility', ['USER_ORGUNIT_CHILDREN'])).toMatchObject([
            { status: 'full', assignment: { assigned: 1, total: 2 } },
        ])
    })

    it('is none for a level above every parent org unit', () => {
        expect(judge('facility', ['facilityAAA', 'LEVEL-2'])).toEqual([
            {
                id: 'LEVEL-2',
                status: 'none',
                reasons: ['NOT_ASSIGNED'],
                assignment: null,
            },
        ])
    })

    it('judges event data where its program is assigned', () => {
        expect(
            judge('pi', ['nationUnit1'], { type: 'PROGRAM_INDICATOR' })
        ).toEqual([
            {
                id: 'nationUnit1',
                status: 'full',
                reasons: ['PARTLY_ASSIGNED'],
                assignment: { assigned: 2, total: 4, level: 3 },
            },
        ])
        expect(
            judge('pi', ['facilityDDD'], { type: 'PROGRAM_INDICATOR' })
        ).toMatchObject([{ status: 'none', reasons: ['NOT_ASSIGNED'] }])
        expect(
            judge('eventProgra.someElement', ['facilityDDD'], {
                type: 'PROGRAM_DATA_ELEMENT',
            })
        ).toMatchObject([{ status: 'none', reasons: ['NOT_ASSIGNED'] }])
    })

    it('needs the program of an indicator too', () => {
        expect(
            judge('casesPerFacility', ['facilityDDD'], { type: 'INDICATOR' })
        ).toMatchObject([
            { status: 'none', reasons: ['OPERAND_EMPTY', 'NOT_ASSIGNED'] },
        ])
    })

    it('judges a group where its members are', () => {
        expect(judge('facility', ['OU_GROUP-clinicGroup'])).toEqual([
            {
                id: 'OU_GROUP-clinicGroup',
                status: 'full',
                reasons: ['PARTLY_ASSIGNED'],
                assignment: { assigned: 1, total: 2, level: 3 },
            },
        ])
        expect(judge('district', ['OU_GROUP-clinicGroup'])).toMatchObject([
            { status: 'none', reasons: ['ASSIGNED_AT_HIGHER_LEVEL'] },
        ])
    })

    it('adds up a group over the levels its members are at', () => {
        expect(judge('facility', ['OU_GROUP-mixedGroupA'])).toMatchObject([
            {
                status: 'full',
                reasons: ['PARTLY_ASSIGNED'],
                assignment: { assigned: 2, total: 3, level: 3 },
            },
        ])
    })

    it('leaves out the levels with no member under the parent org units', () => {
        expect(
            judge('facility', ['districtAAA', 'OU_GROUP-mixedGroupA'])
        ).toEqual([
            {
                id: 'OU_GROUP-mixedGroupA',
                status: 'full',
                reasons: [],
                assignment: { assigned: 1, total: 1, level: 3 },
            },
        ])
    })

    it('is none for a group with no members, which analytics refuses', () => {
        expect(judge('facility', ['OU_GROUP-emptyGroupA'])).toEqual([
            {
                id: 'OU_GROUP-emptyGroupA',
                status: 'none',
                reasons: ['EMPTY_GROUP'],
                assignment: null,
            },
        ])
    })

    it('is full for an item with no source, nothing limits where it has values', () => {
        expect(
            judge('constantsOnly', ['facilityDDD'], { type: 'INDICATOR' })
        ).toEqual([
            {
                id: 'facilityDDD',
                status: 'full',
                reasons: [],
                assignment: null,
            },
        ])
    })

    it('fits any org unit for a program indicator placed by registration or an attribute', () => {
        expect(
            judge('piByRegistr', ['facilityDDD'], { type: 'PROGRAM_INDICATOR' })
        ).toEqual([
            {
                id: 'facilityDDD',
                status: 'full',
                reasons: ['ANY_ORG_UNIT'],
                assignment: null,
            },
        ])
        expect(
            judge('piByAttribu', ['facilityDDD'], { type: 'PROGRAM_INDICATOR' })
        ).toMatchObject([{ status: 'full', reasons: ['ANY_ORG_UNIT'] }])
    })

    it('keeps the program assignment for a program indicator placed by owner', () => {
        expect(
            judge('piByOwner', ['facilityDDD'], { type: 'PROGRAM_INDICATOR' })
        ).toMatchObject([{ status: 'none', reasons: ['NOT_ASSIGNED'] }])
    })

    it('cannot tell for groups or org units not loaded, or missing metadata', () => {
        expect(judge('facility', ['OU_GROUP-notLoadedGr'])).toMatchObject([
            { status: 'unknown', reasons: ['UNKNOWN_ORG_UNIT'] },
        ])
        expect(judge('facility', ['notLoadedUn'])).toMatchObject([
            { status: 'unknown', reasons: ['UNKNOWN_ORG_UNIT'] },
        ])
        expect(
            judge('facility', ['nationUnit1'], { coverage: null })
        ).toMatchObject([{ status: 'unknown', reasons: ['UNKNOWN_ORG_UNIT'] }])
        expect(
            judge('someElement', ['nationUnit1'], { type: 'EVENT_DATA_ITEM' })
        ).toMatchObject([{ status: 'unknown', reasons: ['PROFILE_UNKNOWN'] }])
        expect(
            judge('notThere', ['nationUnit1'], { type: 'PROGRAM_INDICATOR' })
        ).toMatchObject([{ status: 'unknown', reasons: ['PROFILE_UNKNOWN'] }])
        expect(judge('orphan', ['nationUnit1'])).toMatchObject([
            { status: 'unknown', reasons: ['PROFILE_UNKNOWN'] },
        ])
    })
})

describe('getDataItemProfileCompatibility, with org units', () => {
    it('judges periods and org units apart, and combines them overall', () => {
        const result = getDataItemProfileCompatibility(
            profileOf('facility'),
            { periods: ['2025Q1'], orgUnits: ['nationUnit1', 'facilityDDD'] },
            { orgUnitCoverage: COVERAGE }
        )

        expect(result).toMatchObject({
            status: 'none',
            reasons: ['NOT_ASSIGNED', 'PARTLY_ASSIGNED'],
            periods: [{ id: '2025Q1', status: 'full' }],
            orgUnits: [
                { id: 'nationUnit1', status: 'full' },
                { id: 'facilityDDD', status: 'none' },
            ],
        })
    })

    it('leaves org units out when none are asked', () => {
        expect(
            getDataItemProfileCompatibility(profileOf('facility'), {
                periods: ['2025Q1'],
            })
        ).not.toHaveProperty('orgUnits')
    })

    it('judges org units alone', () => {
        expect(
            getDataItemProfileCompatibility(
                profileOf('facility'),
                { orgUnits: ['districtAAA'] },
                { orgUnitCoverage: COVERAGE }
            )
        ).toMatchObject({ status: 'full', periods: [] })
    })
})
