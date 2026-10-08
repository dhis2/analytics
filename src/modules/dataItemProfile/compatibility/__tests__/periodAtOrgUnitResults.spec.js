import {
    ORG_UNIT_COVERAGE as COVERAGE,
    orgUnitProfileOf as profileOf,
} from '../../../../__fixtures__/dataItemProfileOrgUnits.js'
import { getPeriodAtOrgUnitResults } from '../periodAtOrgUnitResults.js'

const judge = (id, selection, { type, coverage = COVERAGE } = {}) =>
    getPeriodAtOrgUnitResults(profileOf(id, type), selection, {
        orgUnitCoverage: coverage,
    }).map(({ periodId, orgUnitId, status, reasons }) => [
        periodId,
        orgUnitId,
        status,
        reasons,
    ])

/* twoForms: a monthly data set at 3 of the 4 facilities (and the nation), a
 * weekly one at facilityDDD only */
describe('getPeriodAtOrgUnitResults', () => {
    it('counts only the data sets assigned at the org unit', () => {
        expect(
            judge('twoForms', {
                periods: ['2025W2'],
                orgUnits: ['facilityAAA', 'facilityDDD'],
            })
        ).toEqual([
            // Only the monthly data set is assigned at facilityAAA: nothing by week
            ['2025W2', 'facilityAAA', 'none', ['PERIOD_TOO_SHORT']],
            // The weekly one fills it at facilityDDD; the nation's monthly values are left out
            ['2025W2', 'facilityDDD', 'partial', ['ASSIGNED_AT_HIGHER_LEVEL']],
        ])
    })

    it('judges each period at each org unit', () => {
        expect(
            judge('twoForms', {
                periods: ['202501', '2025W2'],
                orgUnits: ['facilityAAA'],
            }).map(([periodId, , status]) => [periodId, status])
        ).toEqual([
            ['202501', 'full'],
            ['2025W2', 'none'],
        ])
    })

    it('adds up a level under parents where the data sets are assigned', () => {
        expect(
            judge('facility', {
                periods: ['2025Q1'],
                orgUnits: ['LEVEL-3', 'districtAAA', 'districtBBB'],
            })
        ).toEqual([['2025Q1', 'LEVEL-3', 'full', ['PARTLY_ASSIGNED']]])
    })

    it('is none where nothing is assigned, whatever the period', () => {
        expect(
            judge(
                'pi',
                { periods: ['2025Q1'], orgUnits: ['facilityDDD'] },
                {
                    type: 'PROGRAM_INDICATOR',
                }
            )
        ).toEqual([['2025Q1', 'facilityDDD', 'none', ['NOT_ASSIGNED']]])
    })

    it('gives the org unit result where it needs no period, and cannot tell without coverage or profile', () => {
        expect(
            judge('facility', {
                periods: ['2025Q1'],
                orgUnits: ['OU_GROUP-emptyGroupA'],
            })
        ).toEqual([['2025Q1', 'OU_GROUP-emptyGroupA', 'none', ['EMPTY_GROUP']]])
        expect(
            judge(
                'facility',
                { periods: ['2025Q1'], orgUnits: ['facilityAAA'] },
                { coverage: null }
            )
        ).toEqual([['2025Q1', 'facilityAAA', 'unknown', ['UNKNOWN_ORG_UNIT']]])
        expect(
            judge('missing', {
                periods: ['2025Q1'],
                orgUnits: ['facilityAAA'],
            })
        ).toEqual([['2025Q1', 'facilityAAA', 'unknown', ['PROFILE_UNKNOWN']]])
    })
})
