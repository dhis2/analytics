import { getRelativePeriodsOptions } from '../utils/relativePeriods.js'
import {
    applyDisplayLabelOverrides,
    applyFixedPeriodTypeDisplayLabels,
    filterEnabledRelativePeriodTypes,
    getV43PeriodTypeOptions,
} from '../versions/v43.js'

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

describe('applyFixedPeriodTypeDisplayLabels', () => {
    const fixedOptions = [
        { id: 'WEEKLY', name: 'Weekly' },
        { id: 'MONTHLY', name: 'Monthly' },
    ]

    it('uses the displayLabel of the server period type as name', () => {
        expect(
            applyFixedPeriodTypeDisplayLabels(fixedOptions, [
                { name: 'Weekly', displayLabel: 'Week' },
                { name: 'Monthly' },
            ])
        ).toEqual([
            { id: 'WEEKLY', name: 'Week' },
            { id: 'MONTHLY', name: 'Monthly' },
        ])
    })

    it('returns the options unchanged when there are no labels', () => {
        expect(applyFixedPeriodTypeDisplayLabels(fixedOptions, null)).toBe(
            fixedOptions
        )
        expect(
            applyFixedPeriodTypeDisplayLabels(fixedOptions, [
                { name: 'Weekly' },
            ])
        ).toBe(fixedOptions)
    })
})

describe('filterEnabledRelativePeriodTypes', () => {
    const filter = (enabledServerPeriodTypes, financialYearStart) =>
        filterEnabledRelativePeriodTypes(
            getRelativePeriodsOptions(),
            enabledServerPeriodTypes,
            financialYearStart
        ).map(({ id }) => id)

    it('returns no categories when no period types are enabled', () => {
        expect(filter([])).toEqual([])
        expect(filter(null)).toEqual([])
    })

    it('shows a category when any period type of its family is enabled', () => {
        expect(
            filter([{ name: 'WeeklySunday' }, { name: 'SixMonthlyApril' }])
        ).toEqual(['WEEKLY', 'SIXMONTHLY'])
    })

    it('shows financial years only when the financial year start is set', () => {
        const enabledTypes = [{ name: 'Monthly' }, { name: 'FinancialOct' }]

        expect(filter(enabledTypes)).toEqual(['MONTHLY'])
        expect(filter(enabledTypes, 'FINANCIAL_YEAR_OCTOBER')).toEqual([
            'MONTHLY',
            'FINANCIAL',
        ])
    })
})

describe('applyDisplayLabelOverrides', () => {
    const relativeOptions = getRelativePeriodsOptions().filter(({ id }) =>
        ['WEEKLY', 'MONTHLY'].includes(id)
    )

    it('renames the weekly category and its relative periods', () => {
        const [weeklyOption, monthlyOption] = applyDisplayLabelOverrides(
            relativeOptions,
            {
                weeklyDisplayLabel: 'EPI week',
                metaData: { THIS_WEEK: { name: 'This EPI week' } },
            }
        )

        expect(weeklyOption.name).toBe('EPI week')
        expect(
            weeklyOption.getPeriods().find(({ id }) => id === 'THIS_WEEK').name
        ).toBe('This EPI week')
        expect(monthlyOption).toBe(relativeOptions[1])
    })

    it('returns the options unchanged when there are no labels', () => {
        expect(applyDisplayLabelOverrides(relativeOptions, {})).toBe(
            relativeOptions
        )
    })
})
