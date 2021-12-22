import { getFixedPeriodsOptions } from '../utils/fixedPeriods.js'
import { filterPeriodTypesById } from '../utils/index.js'
import { getRelativePeriodsOptions } from '../utils/relativePeriods.js'

describe('utils', () => {
    describe('filterPeriodTypesById', () => {
        it('should filter fixed periods', () => {
            const excludedPeriodTypes = [
                'DAILY',
                'WEEKLY',
                'WEEKLYSAT',
                'MONTHLY',
                'FYOCT',
            ]
            const periodIds = filterPeriodTypesById(
                getFixedPeriodsOptions(),
                excludedPeriodTypes
            ).map((option) => option.id)

            expect(periodIds).toEqual([
                'WEEKLYWED',
                'WEEKLYTHU',
                'WEEKLYSUN',
                'BIWEEKLY',
                'BIMONTHLY',
                'QUARTERLY',
                'SIXMONTHLY',
                'SIXMONTHLYAPR',
                'YEARLY',
                'FYNOV',
                'FYJUL',
                'FYAPR',
            ])
        })

        it('should filter relative periods', () => {
            const excludedPeriodTypes = ['MONTHLY', 'BIMONTHLY']
            const periodIds = filterPeriodTypesById(
                getRelativePeriodsOptions(),
                excludedPeriodTypes
            ).map((option) => option.id)

            expect(periodIds).toEqual([
                'DAILY',
                'WEEKLY',
                'BIWEEKLY',
                'QUARTERLY',
                'SIXMONTHLY',
                'FINANCIAL',
                'YEARLY',
            ])
        })
    })
})
