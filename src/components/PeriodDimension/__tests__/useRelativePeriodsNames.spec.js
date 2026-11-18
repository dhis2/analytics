import { renderHook } from '@testing-library/react'
import { useDataOutputPeriodTypes } from '../useDataOutputPeriodTypes.js'
import { useRelativePeriodsNames } from '../useRelativePeriodsNames.js'
import { getRelativePeriodsName } from '../utils/relativePeriods.js'

jest.mock('../useDataOutputPeriodTypes.js', () => ({
    useDataOutputPeriodTypes: jest.fn(),
}))

const mockDataOutputPeriodTypes = ({
    enabledPeriodTypesData = null,
    loading = false,
    error = null,
} = {}) =>
    useDataOutputPeriodTypes.mockReturnValue({
        supportsEnabledPeriodTypes: Boolean(enabledPeriodTypesData),
        enabledPeriodTypesData,
        loading,
        error,
    })

describe('useRelativePeriodsNames', () => {
    afterEach(() => {
        jest.resetAllMocks()
    })

    it('returns the hardcoded names on v42', () => {
        mockDataOutputPeriodTypes()

        const { result } = renderHook(() => useRelativePeriodsNames())

        expect(result.current.relativePeriodsNames).toEqual(
            getRelativePeriodsName()
        )
        expect(result.current.relativePeriodsNames.LAST_5_YEARS).toBe(
            'Last 5 years'
        )
        expect(result.current.loading).toBe(false)
        expect(result.current.error).toBeNull()
    })

    it('applies the derived names on v43', () => {
        mockDataOutputPeriodTypes({
            enabledPeriodTypesData: {
                version: 43,
                metaData: {
                    THIS_WEEK: { name: 'This EPI week' },
                    LAST_FINANCIAL_YEAR: { name: 'Last FY October' },
                },
            },
        })

        const { result } = renderHook(() => useRelativePeriodsNames())

        expect(result.current.relativePeriodsNames).toEqual({
            ...getRelativePeriodsName(),
            THIS_WEEK: 'This EPI week',
            LAST_FINANCIAL_YEAR: 'Last FY October',
        })
    })

    it('handles v43 without enabled period types (no metaData)', () => {
        mockDataOutputPeriodTypes({
            enabledPeriodTypesData: { version: 43, noEnabledTypes: true },
        })

        const { result } = renderHook(() => useRelativePeriodsNames())

        expect(result.current.relativePeriodsNames).toEqual(
            getRelativePeriodsName()
        )
    })

    it('uses the server names on v44, with the hardcoded names as fallback', () => {
        mockDataOutputPeriodTypes({
            enabledPeriodTypesData: {
                version: 44,
                metaData: {
                    LAST_5_YEARS: { name: 'Les 5 dernières années' },
                    TODAY: { name: "Aujourd'hui" },
                },
            },
        })

        const { result } = renderHook(() => useRelativePeriodsNames())
        const names = result.current.relativePeriodsNames

        expect(names.LAST_5_YEARS).toBe('Les 5 dernières années')
        expect(names.TODAY).toBe("Aujourd'hui")
        // not returned by the server (i.e. disabled period type)
        expect(names.LAST_10_YEARS).toBe('Last 10 years')
        expect(Object.keys(names)).toEqual(
            Object.keys(getRelativePeriodsName())
        )
    })

    it('returns the hardcoded names and the loading state while loading', () => {
        mockDataOutputPeriodTypes({ loading: true })

        const { result } = renderHook(() => useRelativePeriodsNames())

        expect(result.current.loading).toBe(true)
        expect(result.current.relativePeriodsNames).toEqual(
            getRelativePeriodsName()
        )
    })

    it('returns the hardcoded names and the error when the request fails', () => {
        const error = new Error('Request failed')
        mockDataOutputPeriodTypes({ error })

        const { result } = renderHook(() => useRelativePeriodsNames())

        expect(result.current.error).toBe(error)
        expect(result.current.relativePeriodsNames).toEqual(
            getRelativePeriodsName()
        )
    })

    it('does not mutate the hardcoded names', () => {
        mockDataOutputPeriodTypes({
            enabledPeriodTypesData: {
                version: 44,
                metaData: { TODAY: { name: "Aujourd'hui" } },
            },
        })

        renderHook(() => useRelativePeriodsNames())

        expect(getRelativePeriodsName().TODAY).toBe('Today')
    })
})
