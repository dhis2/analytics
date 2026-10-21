import { getV43PeriodTypeOptions } from '../versions/v43.js'

// Shape of /api/configuration/dataOutputPeriodTypes (v43)
const enabledTypes = [
    { name: 'Daily', displayLabel: 'Day' },
    { name: 'Weekly', displayLabel: 'Week' },
    { name: 'Monthly', displayLabel: 'Month' },
]

const getOptions = (excludedPeriodTypes) =>
    getV43PeriodTypeOptions({
        enabledPeriodTypesData: {
            version: 43,
            enabledTypes,
            financialYearStart: null,
            metaData: {},
        },
        periodsSettings: { calendar: 'gregory', locale: 'en' },
        excludedPeriodTypes,
    })

describe('v43 period type options', () => {
    it('shows all enabled period types when nothing is excluded', () => {
        const { fixedOptions, relativeOptions } = getOptions([])

        expect(fixedOptions.map(({ id }) => id)).toEqual([
            'DAILY',
            'WEEKLY',
            'MONTHLY',
        ])
        expect(relativeOptions.map(({ id }) => id)).toEqual([
            'DAILY',
            'WEEKLY',
            'MONTHLY',
        ])
    })

    it('applies excludedPeriodTypes to both fixed and relative options', () => {
        const { fixedOptions, relativeOptions } = getOptions([
            'DAILY',
            'WEEKLY',
        ])

        expect(fixedOptions.map(({ id }) => id)).toEqual(['MONTHLY'])
        expect(relativeOptions.map(({ id }) => id)).toEqual(['MONTHLY'])
    })
})
