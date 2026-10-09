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
const weekly = {
    name: 'Weekly',
    displayName: 'Hebdomadaire',
    relativePeriods: {
        THIS_WEEK: { displayName: 'Cette semaine' },
        LAST_WEEK: { displayName: 'Semaine dernière' },
    },
}
const weeklySunday = { name: 'WeeklySunday', displayName: 'EPI Week' }
const monthly = {
    name: 'Monthly',
    displayName: 'Mois',
    relativePeriods: {
        THIS_MONTH: { displayName: 'Ce mois-ci' },
        LAST_MONTH: { displayName: 'x-Last_Month' },
        MONTHS_LAST_YEAR: { displayName: "Mois de l'an dernier" },
    },
}
const quarterlyNov = { name: 'QuarterlyNov', displayName: 'Quarterly Nov' }
const financialApril = { name: 'FinancialApril', displayName: 'FY April' }
const financialOct = { name: 'FinancialOct', displayName: 'FY October' }

const getOptions = (enabledTypes, excludedPeriodTypes = []) =>
    getV44PeriodTypeOptions({
        enabledPeriodTypesData: { version: 44, enabledTypes },
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
    it('uses server displayName for fixed period types, in server order', () => {
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

    it('falls back to client relative periods when the server does not nest them', () => {
        // Weekly disabled: server nests weekly relative periods under Weekly only
        const { relativeOptions } = getOptions([weeklySunday])

        expect(relativeOptions).toHaveLength(1)
        expect(relativeOptions[0].id).toBe('WEEKLY')
        expect(relativeOptions[0].name).toBe('EPI Week')
        expect(relativeOptions[0].getPeriods().map(({ id }) => id)).toContain(
            'THIS_WEEK'
        )
    })

    it('shows financial year relative periods when any financial type is enabled', () => {
        const single = getOptions([financialOct]).relativeOptions
        expect(single.map(({ id, name }) => ({ id, name }))).toEqual([
            { id: 'FINANCIAL', name: 'FY October' },
        ])
        expect(single[0].getPeriods().map(({ id }) => id)).toContain(
            'THIS_FINANCIAL_YEAR'
        )

        // ambiguous family label, use the client category name
        const multiple = getOptions([
            financialApril,
            financialOct,
        ]).relativeOptions
        expect(multiple.map(({ id, name }) => ({ id, name }))).toEqual([
            { id: 'FINANCIAL', name: 'Financial Years' },
        ])
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
        mockQueryState.localeRefetch = jest.fn()
        mockQueryState.v44Data = undefined

        useDataQuery.mockImplementation((query, options) => {
            if (query.userSettings) {
                mockQueryState.localeOptions = options
                return { refetch: mockQueryState.localeRefetch }
            }
            return {
                data: mockQueryState.v44Data,
                error: undefined,
                refetch: mockQueryState.v44Refetch,
            }
        })
    })

    it('does not fetch when disabled', () => {
        renderHook(() => useV44DataOutputPeriodTypes({ enabled: false }))

        expect(mockQueryState.localeRefetch).not.toHaveBeenCalled()
        expect(mockQueryState.v44Refetch).not.toHaveBeenCalled()
    })

    it('fetches period types in the user ui locale', () => {
        renderHook(() => useV44DataOutputPeriodTypes({ enabled: true }))

        expect(mockQueryState.localeRefetch).toHaveBeenCalledTimes(1)

        mockQueryState.localeOptions.onComplete({
            userSettings: { keyUiLocale: 'fr' },
        })
        expect(mockQueryState.v44Refetch).toHaveBeenCalledWith({
            locale: 'fr',
        })

        // still fetches period types if the user locale request fails
        mockQueryState.localeOptions.onError()
        expect(mockQueryState.v44Refetch).toHaveBeenLastCalledWith({})
    })

    it('returns enabled types and relative period name overrides', () => {
        mockQueryState.v44Data = {
            periodTypes: [daily, monthly],
            analysisRelativePeriod: {
                keyAnalysisRelativePeriod: 'LAST_12_MONTHS',
            },
        }

        const { result } = renderHook(() =>
            useV44DataOutputPeriodTypes({ enabled: true })
        )

        expect(result.current).toEqual({
            version: 44,
            enabledTypes: [daily, monthly],
            analysisRelativePeriod: 'LAST_12_MONTHS',
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

    it('flags when no period types are enabled', () => {
        mockQueryState.v44Data = { periodTypes: [] }

        const { result } = renderHook(() =>
            useV44DataOutputPeriodTypes({ enabled: true })
        )

        expect(result.current.noEnabledTypes).toBe(true)
    })
})
