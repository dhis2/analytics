import { renderHook } from '@testing-library/react'
import {
    getV44PeriodTypeOptions,
    useV44DataOutputPeriodTypes,
} from '../versions/v44.js'

jest.mock('@dhis2/app-runtime', () => ({
    useDataQuery: jest.fn(),
}))

// Shape of /api/configuration/dataOutputPeriodTypes?fields=name,displayName,relativePeriods (v44)
const daily = {
    name: 'Daily',
    displayName: 'Quotidien',
    relativePeriods: {
        TODAY: { displayName: "Aujourd'hui" },
        YESTERDAY: { displayName: 'Hier' },
    },
}
// relative periods are nested under every period type of the family,
// with the same labels
const weeklyRelativePeriods = {
    THIS_WEEK: { displayName: 'Cette semaine' },
    LAST_WEEK: { displayName: 'Semaine dernière' },
}
const weekly = {
    name: 'Weekly',
    displayName: 'Hebdomadaire',
    relativePeriods: weeklyRelativePeriods,
}
const weeklySunday = {
    name: 'WeeklySunday',
    displayName: 'EPI Week',
    relativePeriods: weeklyRelativePeriods,
}
const monthly = {
    name: 'Monthly',
    displayName: 'Mois',
    relativePeriods: {
        THIS_MONTH: { displayName: 'Ce mois-ci' },
        LAST_MONTH: { displayName: 'x-Last_Month' },
        MONTHS_LAST_YEAR: { displayName: "Mois de l'an dernier" },
    },
}
const quarterlyRelativePeriods = {
    THIS_QUARTER: { displayName: 'Ce trimestre' },
}
const quarterly = {
    name: 'Quarterly',
    displayName: 'Trimestriel',
    relativePeriods: quarterlyRelativePeriods,
}
const quarterlyNov = {
    name: 'QuarterlyNov',
    displayName: 'Quarterly Nov',
    relativePeriods: quarterlyRelativePeriods,
}
const financialRelativePeriods = {
    THIS_FINANCIAL_YEAR: { displayName: 'Cet exercice' },
    LAST_FINANCIAL_YEAR: { displayName: 'Exercice précédent' },
}
const financialApril = {
    name: 'FinancialApril',
    displayName: 'FY April',
    relativePeriods: financialRelativePeriods,
}
const financialOct = {
    name: 'FinancialOct',
    displayName: 'FY October',
    relativePeriods: financialRelativePeriods,
}

const DEFAULT_START_TYPES = { WEEKLY: 'Weekly', FINANCIAL: 'FinancialOct' }

const getOptions = (
    enabledTypes,
    excludedPeriodTypes = [],
    relativePeriodStartTypes = DEFAULT_START_TYPES
) =>
    getV44PeriodTypeOptions({
        enabledPeriodTypesData: {
            version: 44,
            enabledTypes,
            relativePeriodStartTypes,
        },
        periodsSettings: { calendar: 'gregory', locale: 'en' },
        excludedPeriodTypes,
    })

const summarize = (options) =>
    options.map(({ id, name, getPeriods }) => ({
        id,
        name,
        periods: getPeriods().map((p) => `${p.id}:${p.name}`),
    }))

describe('v44 period type options', () => {
    it('uses server displayName for fixed period types', () => {
        const { fixedOptions } = getOptions([
            daily,
            weekly,
            weeklySunday,
            monthly,
            financialApril,
        ])

        expect(fixedOptions.map(({ id, name }) => ({ id, name }))).toEqual([
            { id: 'DAILY', name: 'Quotidien' },
            { id: 'WEEKLY', name: 'Hebdomadaire' },
            { id: 'WEEKLYSUN', name: 'EPI Week' },
            { id: 'MONTHLY', name: 'Mois' },
            { id: 'FYAPR', name: 'FY April' },
        ])
        expect(typeof fixedOptions[0].getPeriods).toBe('function')
    })

    it('skips server period types the client cannot generate periods for', () => {
        const { fixedOptions } = getOptions([monthly, quarterlyNov])

        expect(fixedOptions.map(({ id }) => id)).toEqual(['MONTHLY'])
    })

    it('uses the nested relative periods with server displayName', () => {
        const { relativeOptions } = getOptions([daily, weekly, monthly])

        expect(summarize(relativeOptions)).toEqual([
            {
                id: 'DAILY',
                name: 'Quotidien',
                periods: ["TODAY:Aujourd'hui", 'YESTERDAY:Hier'],
            },
            {
                id: 'WEEKLY',
                name: 'Hebdomadaire',
                periods: [
                    'THIS_WEEK:Cette semaine',
                    'LAST_WEEK:Semaine dernière',
                ],
            },
            {
                id: 'MONTHLY',
                name: 'Mois',
                periods: [
                    'THIS_MONTH:Ce mois-ci',
                    'LAST_MONTH:x-Last_Month',
                    "MONTHS_LAST_YEAR:Mois de l'an dernier",
                ],
            },
        ])
    })

    it('shows one weekly category when several weekly types are enabled', () => {
        const { relativeOptions } = getOptions([weekly, weeklySunday])

        expect(relativeOptions.map(({ id, name }) => ({ id, name }))).toEqual([
            { id: 'WEEKLY', name: 'Hebdomadaire' },
        ])
    })

    it('names the weekly category after the weekly start variant from the system setting', () => {
        const { relativeOptions } = getOptions([weekly, weeklySunday], [], {
            ...DEFAULT_START_TYPES,
            WEEKLY: 'WeeklySunday',
        })

        expect(summarize(relativeOptions)).toEqual([
            {
                id: 'WEEKLY',
                name: 'EPI Week',
                periods: [
                    'THIS_WEEK:Cette semaine',
                    'LAST_WEEK:Semaine dernière',
                ],
            },
        ])
    })

    it('hides weekly relative periods when the weekly start variant is disabled', () => {
        const { relativeOptions } = getOptions([weeklySunday, monthly])

        expect(relativeOptions.map(({ id }) => id)).toEqual(['MONTHLY'])
    })

    it('shows weekly relative periods when only the weekly start variant is enabled', () => {
        const { relativeOptions } = getOptions([weeklySunday], [], {
            ...DEFAULT_START_TYPES,
            WEEKLY: 'WeeklySunday',
        })

        expect(summarize(relativeOptions)).toEqual([
            {
                id: 'WEEKLY',
                name: 'EPI Week',
                periods: [
                    'THIS_WEEK:Cette semaine',
                    'LAST_WEEK:Semaine dernière',
                ],
            },
        ])
    })

    it('shows financial year relative periods for the financial year start variant from the system setting', () => {
        const { relativeOptions } = getOptions([financialApril, financialOct])

        expect(summarize(relativeOptions)).toEqual([
            {
                id: 'FINANCIAL',
                name: 'FY October',
                periods: [
                    'THIS_FINANCIAL_YEAR:Cet exercice',
                    'LAST_FINANCIAL_YEAR:Exercice précédent',
                ],
            },
        ])
    })

    it('shows one quarterly category named after the first enabled quarterly type', () => {
        expect(
            summarize(getOptions([quarterly, quarterlyNov]).relativeOptions)
        ).toEqual([
            {
                id: 'QUARTERLY',
                name: 'Trimestriel',
                periods: ['THIS_QUARTER:Ce trimestre'],
            },
        ])
        expect(
            getOptions([quarterlyNov]).relativeOptions.map(({ name }) => name)
        ).toEqual(['Quarterly Nov'])
    })

    it('hides a category when the server returns no relative periods for it', () => {
        const { relativeOptions } = getOptions([
            { ...monthly, relativePeriods: {} },
        ])

        expect(relativeOptions).toEqual([])
    })

    it('hides financial year relative periods when the start variant is disabled or not set', () => {
        expect(getOptions([financialApril]).relativeOptions).toEqual([])
        expect(
            getOptions([financialOct], [], {
                ...DEFAULT_START_TYPES,
                FINANCIAL: null,
            }).relativeOptions
        ).toEqual([])
    })

    it('applies excludedPeriodTypes to both fixed and relative options', () => {
        const { fixedOptions, relativeOptions } = getOptions(
            [daily, weekly, monthly],
            ['DAILY', 'WEEKLY']
        )

        expect(fixedOptions.map(({ id }) => id)).toEqual(['MONTHLY'])
        expect(relativeOptions.map(({ id }) => id)).toEqual(['MONTHLY'])
    })

    it('returns no options when no period types are enabled', () => {
        expect(getOptions([])).toEqual({
            fixedOptions: [],
            relativeOptions: [],
        })
    })
})

describe('useV44DataOutputPeriodTypes', () => {
    const mockQueryState = {}

    beforeEach(() => {
        const { useDataQuery } = require('@dhis2/app-runtime')
        mockQueryState.v44Refetch = jest.fn()
        mockQueryState.v44Data = undefined

        useDataQuery.mockImplementation(() => ({
            data: mockQueryState.v44Data,
            error: undefined,
            refetch: mockQueryState.v44Refetch,
        }))
    })

    it('does not fetch when disabled', () => {
        renderHook(() => useV44DataOutputPeriodTypes({ enabled: false }))

        expect(mockQueryState.v44Refetch).not.toHaveBeenCalled()
    })

    it('fetches period types without a locale (server uses the user db locale)', () => {
        const { useDataQuery } = require('@dhis2/app-runtime')

        renderHook(() => useV44DataOutputPeriodTypes({ enabled: true }))

        expect(mockQueryState.v44Refetch).toHaveBeenCalledTimes(1)
        expect(mockQueryState.v44Refetch).toHaveBeenCalledWith()
        const [query] = useDataQuery.mock.calls[0]
        expect(query.periodTypes.params).not.toHaveProperty('locale')
    })

    it('returns enabled types and relative period name overrides', () => {
        mockQueryState.v44Data = {
            periodTypes: [daily, monthly],
            analysisRelativePeriod: {
                keyAnalysisRelativePeriod: 'LAST_12_MONTHS',
            },
            weeklyStart: { analyticsWeeklyStart: 'WEEKLY_SUNDAY' },
            financialYearStart: {
                analyticsFinancialYearStart: 'FINANCIAL_YEAR_APRIL',
            },
        }

        const { result } = renderHook(() =>
            useV44DataOutputPeriodTypes({ enabled: true })
        )

        expect(result.current).toEqual({
            version: 44,
            enabledTypes: [daily, monthly],
            analysisRelativePeriod: 'LAST_12_MONTHS',
            relativePeriodStartTypes: {
                WEEKLY: 'WeeklySunday',
                FINANCIAL: 'FinancialApril',
            },
            noEnabledTypes: false,
            metaData: {
                TODAY: { name: "Aujourd'hui" },
                YESTERDAY: { name: 'Hier' },
                THIS_MONTH: { name: 'Ce mois-ci' },
                LAST_MONTH: { name: 'x-Last_Month' },
                MONTHS_LAST_YEAR: { name: "Mois de l'an dernier" },
            },
        })
    })

    it('defaults the weekly start to Weekly when the setting is missing', () => {
        mockQueryState.v44Data = { periodTypes: [weekly] }

        const { result } = renderHook(() =>
            useV44DataOutputPeriodTypes({ enabled: true })
        )

        expect(result.current.relativePeriodStartTypes).toEqual({
            WEEKLY: 'Weekly',
            FINANCIAL: null,
        })
    })

    it('keeps the server order of period types', () => {
        mockQueryState.v44Data = {
            periodTypes: [daily, monthly, financialOct],
        }

        const { result } = renderHook(() =>
            useV44DataOutputPeriodTypes({ enabled: true })
        )

        expect(result.current.enabledTypes.map(({ name }) => name)).toEqual([
            'Daily',
            'Monthly',
            'FinancialOct',
        ])
    })

    it('flags when no period types are enabled', () => {
        mockQueryState.v44Data = { periodTypes: [] }

        const { result } = renderHook(() =>
            useV44DataOutputPeriodTypes({ enabled: true })
        )

        expect(result.current.noEnabledTypes).toBe(true)
    })
})
