import {
    ORG_UNIT_COVERAGE as COVERAGE,
    orgUnitProfileOf as profileOf,
} from '../../../../__fixtures__/dataItemProfileOrgUnits.js'
import { getDataItemProfileOrgUnitCompatibility } from '../getDataItemProfileOrgUnitCompatibility.js'

const judge = (id, orgUnits, { type, coverage = COVERAGE } = {}) =>
    getDataItemProfileOrgUnitCompatibility(
        profileOf(id, type),
        { orgUnits },
        { orgUnitCoverage: coverage }
    )

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

    it('is full where only some are, since the others aren’t assigned', () => {
        expect(judge('facility', ['nationUnit1'])).toEqual([
            {
                id: 'nationUnit1',
                status: 'full',
                reasons: ['PARTLY_ASSIGNED'],
                assignment: { assigned: 3, total: 4, level: 3 },
            },
        ])
    })

    it('gives no total, nor PARTLY_ASSIGNED, when the org units weren’t counted', () => {
        const withoutTotals = {
            ...COVERAGE,
            counts: Object.fromEntries(
                Object.entries(COVERAGE.counts).map(([key, counts]) => [
                    key,
                    { ...counts, totals: {} },
                ])
            ),
        }

        expect(
            judge('facility', ['nationUnit1'], { coverage: withoutTotals })
        ).toEqual([
            {
                id: 'nationUnit1',
                status: 'full',
                reasons: [],
                assignment: { assigned: 3, level: 3 },
            },
        ])
        expect(
            judge('facility', ['LEVEL-2'], { coverage: withoutTotals })[0]
                .assignment
        ).toEqual({ assigned: 3, level: 3 })
    })

    it('is none, assigned higher, where only an ancestor of the org unit is assigned', () => {
        expect(judge('facility', ['facilityDDD'])).toMatchObject([
            {
                status: 'none',
                reasons: ['ASSIGNED_AT_HIGHER_LEVEL'],
                assignment: null,
            },
        ])
    })

    it('is none, not assigned, where neither the org unit nor its ancestors are', () => {
        expect(
            judge('pi', ['facilityDDD'], { type: 'PROGRAM_INDICATOR' })
        ).toMatchObject([
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
        // The monthly form is assigned to the nation above facilityDDD: its values are left out there
        expect(judge('twoForms', ['facilityDDD'])).toMatchObject([
            { status: 'partial', reasons: ['ASSIGNED_AT_HIGHER_LEVEL'] },
        ])
        expect(judge('twoForms', ['nationUnit1'])).toMatchObject([
            {
                status: 'full',
                reasons: ['PARTLY_ASSIGNED'],
                assignment: { assigned: 3, total: 4 },
            },
        ])
    })

    it('is not partly assigned when one data set is assigned to every org unit', () => {
        const coverage = {
            ...COVERAGE,
            counts: {
                ...COVERAGE.counts,
                districtBBB: {
                    totals: { 2: 1, 3: 2 },
                    sources: {
                        MonthlyForm: { byLevel: { 3: 2 } },
                        WeeklyForm: { byLevel: { 3: 1 } },
                    },
                },
            },
        }

        expect(judge('twoForms', ['districtBBB'], { coverage })).toEqual([
            {
                id: 'districtBBB',
                status: 'full',
                reasons: [],
                assignment: { assigned: 2, total: 2, level: 3 },
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
            {
                status: 'none',
                reasons: ['OPERAND_EMPTY', 'ASSIGNED_AT_HIGHER_LEVEL'],
            },
        ])
    })

    it('is partial for a sum where one item has no value, which counts as 0', () => {
        expect(
            judge('facilityPlusDistrict', ['facilityAAA'], {
                type: 'INDICATOR',
            })
        ).toMatchObject([
            {
                status: 'partial',
                reasons: ['OPERAND_EMPTY', 'ASSIGNED_AT_HIGHER_LEVEL'],
            },
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

    it('is none, with no org units there, for a level above every parent or below the hierarchy', () => {
        expect(judge('facility', ['facilityAAA', 'LEVEL-2'])).toEqual([
            {
                id: 'LEVEL-2',
                status: 'none',
                reasons: ['NO_ORG_UNITS_AT_LEVEL'],
                assignment: null,
            },
        ])
        expect(judge('facility', ['nationUnit1', 'LEVEL-9'])).toMatchObject([
            { status: 'none', reasons: ['NO_ORG_UNITS_AT_LEVEL'] },
        ])
    })

    it('adds up a level under several parents: one with nothing assigned only lowers the counts', () => {
        expect(
            judge('pi', ['districtAAA', 'districtBBB', 'LEVEL-3'], {
                type: 'PROGRAM_INDICATOR',
            })
        ).toEqual([
            {
                id: 'LEVEL-3',
                status: 'full',
                reasons: ['PARTLY_ASSIGNED'],
                assignment: { assigned: 2, total: 4, level: 3 },
            },
        ])
    })

    it('is partial for a level under several parents where values are left out', () => {
        expect(
            judge('twoLevels', ['districtAAA', 'districtBBB', 'LEVEL-3'])
        ).toMatchObject([
            {
                status: 'partial',
                reasons: ['ASSIGNED_AT_HIGHER_LEVEL', 'PARTLY_ASSIGNED'],
                assignment: { assigned: 3, total: 4, level: 3 },
            },
        ])
    })

    it('is partial for a level under several parents where an operand has no value under one', () => {
        // districtBBB: facilities collect the numerator, nothing the denominator
        const coverage = {
            ...COVERAGE,
            counts: {
                ...COVERAGE.counts,
                districtBBB: {
                    totals: { 2: 1, 3: 2 },
                    sources: {
                        MonthlyForm: { byLevel: { 3: 1 } },
                        QuarterlyForm: { byLevel: {} },
                    },
                },
            },
        }

        expect(
            judge('ratio', ['LEVEL-2', 'districtAAA', 'districtBBB'], {
                type: 'INDICATOR',
                coverage,
            })
        ).toMatchObject([
            {
                status: 'partial',
                reasons: ['OPERAND_EMPTY', 'PARTLY_ASSIGNED'],
            },
        ])
    })

    it('takes the user org units as parents of a level', () => {
        expect(judge('facility', ['USER_ORGUNIT', 'LEVEL-3'])).toEqual([
            {
                id: 'LEVEL-3',
                status: 'full',
                reasons: ['PARTLY_ASSIGNED'],
                assignment: { assigned: 1, total: 2, level: 3 },
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
            {
                status: 'none',
                reasons: [
                    'OPERAND_EMPTY',
                    'NOT_ASSIGNED',
                    'ASSIGNED_AT_HIGHER_LEVEL',
                ],
            },
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
