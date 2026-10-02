import { CustomDataProvider } from '@dhis2/app-runtime'
import { act, renderHook, waitFor } from '@testing-library/react'
import PropTypes from 'prop-types'
import React from 'react'
import { useDataItemProfiles } from '../useDataItemProfiles.js'

let mockConfig = { systemInfo: {} }

jest.mock('@dhis2/app-runtime', () => ({
    ...jest.requireActual('@dhis2/app-runtime'),
    useConfig: () => mockConfig,
}))

afterEach(() => {
    mockConfig = { systemInfo: {} }
})

const OBJECTS = {
    dataElements: {
        monthly: {
            aggregationType: 'SUM',
            dataSetElements: [{ dataSet: { periodType: 'Monthly' } }],
        },
        weekly: {
            aggregationType: 'SUM',
            dataSetElements: [{ dataSet: { periodType: 'Weekly' } }],
        },
        population: {
            aggregationType: 'AVERAGE',
            // An object, as some versions send it
            dataSetElements: [{ dataSet: { periodType: { name: 'Yearly' } } }],
        },
        assigned: {
            aggregationType: 'SUM',
            dataSetElements: [
                { dataSet: { id: 'formAAAAAAA', periodType: 'Monthly' } },
            ],
        },
    },
    indicators: {
        coverage: { numerator: '#{monthly}', denominator: '#{population}' },
    },
    dataSets: {},
    expressionDimensionItems: {},
}

const byIdFilter = (resource) =>
    jest.fn((type, { params }) => {
        const ids = params.filter.match(/\[(.*)\]/)[1].split(',')

        return {
            // A gist response, as 2.44 sends for some fields
            gist: true,
            [resource]: ids
                .filter((id) => OBJECTS[resource][id])
                .map((id) => ({ id, ...OBJECTS[resource][id] })),
        }
    })

const createData = (overrides = {}) => ({
    dataElements: byIdFilter('dataElements'),
    indicators: byIdFilter('indicators'),
    dataSets: byIdFilter('dataSets'),
    expressionDimensionItems: byIdFilter('expressionDimensionItems'),
    'systemSettings/analyticsWeeklyStart': {
        analyticsWeeklyStart: 'WEEKLY',
    },
    'systemSettings/analyticsFinancialYearStart': {
        analyticsFinancialYearStart: 'FINANCIAL_YEAR_OCTOBER',
    },
    organisationUnitLevels: {
        organisationUnitLevels: [{ id: 'levelOne111', level: 1 }],
    },
    // Counts with pageSize=1 (3 units, 2 of them with filters on a data set)
    organisationUnits: (type, { params }) =>
        params.pageSize === 1
            ? { pager: { total: params.filter.length === 3 ? 2 : 3 } }
            : {
                  organisationUnits: [
                      { id: 'nationUnit1', level: 1, path: '/nationUnit1' },
                  ],
              },
    ...overrides,
})

const createWrapper = (data) => {
    const Wrapper = ({ children }) => (
        <CustomDataProvider data={data}>{children}</CustomDataProvider>
    )
    Wrapper.propTypes = { children: PropTypes.node }

    return Wrapper
}

const MONTHLY = { id: 'monthly', dimensionItemType: 'DATA_ELEMENT' }
const WEEKLY = { id: 'weekly', dimensionItemType: 'DATA_ELEMENT' }
const COVERAGE = { id: 'coverage', dimensionItemType: 'INDICATOR' }

describe('useDataItemProfiles', () => {
    const renderProfiles = (items, data = createData(), options) =>
        renderHook((props) => useDataItemProfiles(props, options), {
            initialProps: items,
            wrapper: createWrapper(data),
        })

    it('loads the profile of each item', async () => {
        const { result } = renderProfiles([MONTHLY, COVERAGE])

        expect(result.current.loading).toBe(true)

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.error).toBeUndefined()
        expect(result.current.profiles.monthly).toMatchObject({
            unknown: false,
            period: { finest: 'Monthly' },
        })
        expect(result.current.profiles.coverage).toMatchObject({
            period: {
                types: ['Monthly', 'Yearly'],
                finest: 'Yearly',
                mixed: true,
            },
        })
    })

    it('checks periods, with the settings for relative periods', async () => {
        const { result } = renderProfiles([WEEKLY])

        await waitFor(() => expect(result.current.profiles).toBeDefined())

        expect(result.current.relativePeriodTypes).toEqual({
            weeklyPeriodType: 'Weekly',
            financialYearPeriodType: 'FinancialOct',
        })
        expect(
            result.current.getDataItemCompatibility('weekly', {
                periods: ['LAST_4_WEEKS', '202501'],
            })
        ).toMatchObject({
            status: 'full',
            periods: [
                { status: 'full', alignsWithData: null },
                { status: 'full', alignsWithData: false },
            ],
        })
        expect(
            result.current.getDataItemCompatibility('weekly', {
                periods: ['20250115'],
            }).status
        ).toBe('none')
        expect(
            result.current.getDataItemCompatibility('other', {
                periods: ['202501'],
            })
        ).toBe(undefined)
    })

    it('judges org units from where data sets are assigned', async () => {
        const organisationUnits = jest.fn((type, { params }) =>
            params.pageSize === 1
                ? { pager: { total: params.filter.length === 3 ? 2 : 3 } }
                : {
                      organisationUnits: [
                          { id: 'nationUnit1', level: 1, path: '/nationUnit1' },
                      ],
                  }
        )
        const { result } = renderProfiles(
            [{ id: 'assigned', dimensionItemType: 'DATA_ELEMENT' }],
            createData({
                organisationUnits,
                organisationUnitLevels: {
                    organisationUnitLevels: [{ id: 'levelOne111', level: 1 }],
                },
            }),
            { orgUnits: ['nationUnit1'] }
        )

        await waitFor(() =>
            expect(result.current.orgUnitCoverage).toBeDefined()
        )

        expect(
            result.current.getDataItemCompatibility('assigned', {
                orgUnits: ['nationUnit1'],
            }).orgUnits
        ).toEqual([
            {
                id: 'nationUnit1',
                status: 'full',
                reasons: ['PARTLY_ASSIGNED'],
                coverage: { assigned: 2, total: 3, level: 1 },
            },
        ])
        expect(result.current.loading).toBe(false)
    })

    it('gives profiles their org unit side, or from the coverage when told not to', async () => {
        const assigned = [{ id: 'assigned', dimensionItemType: 'DATA_ELEMENT' }]
        const byDefault = renderProfiles(assigned)

        await waitFor(() =>
            expect(byDefault.result.current.profiles).toBeDefined()
        )

        expect(byDefault.result.current.profiles.assigned.orgUnit).toEqual({
            levels: [1],
            entryLevel: 1,
            mixed: false,
        })

        const skipped = renderProfiles(assigned, createData(), {
            orgUnitLevels: false,
        })

        await waitFor(() =>
            expect(skipped.result.current.profiles).toBeDefined()
        )

        expect(skipped.result.current.profiles.assigned.orgUnit).toBeUndefined()

        const filledLater = renderProfiles(assigned, createData(), {
            orgUnitLevels: false,
            orgUnits: ['nationUnit1'],
        })

        await waitFor(() =>
            expect(filledLater.result.current.orgUnitCoverage).toBeDefined()
        )

        expect(filledLater.result.current.profiles.assigned.orgUnit).toEqual({
            levels: [1],
            entryLevel: 1,
            mixed: false,
        })
    })

    it('gives the error of a failed org unit request', async () => {
        const { result } = renderProfiles(
            [{ id: 'assigned', dimensionItemType: 'DATA_ELEMENT' }],
            createData({
                organisationUnits: { organisationUnits: [] },
                organisationUnitLevels: () =>
                    Promise.reject(new Error('no levels')),
            }),
            { orgUnits: ['nationUnit1'] }
        )

        await waitFor(() => expect(result.current.error).toBeDefined())

        expect(result.current.error.message).toBe('no levels')
        expect(result.current.orgUnitCoverage).toBeUndefined()
    })

    it('is unknown for relative weeks on a version without the setting', async () => {
        const data = createData()
        delete data['systemSettings/analyticsWeeklyStart']
        const { result } = renderProfiles([WEEKLY], data)

        await waitFor(() => expect(result.current.profiles).toBeDefined())

        expect(result.current.relativePeriodTypes.weeklyPeriodType).toBe(
            undefined
        )
        expect(
            result.current.getDataItemCompatibility('weekly', {
                periods: ['LAST_4_WEEKS'],
            }).status
        ).toBe('unknown')
    })

    it('is unknown for an item the server does not have', async () => {
        const { result } = renderProfiles([
            { id: 'gone', dimensionItemType: 'DATA_ELEMENT' },
        ])

        await waitFor(() => expect(result.current.profiles).toBeDefined())

        expect(result.current.profiles.gone).toMatchObject({
            unknown: true,
            reasons: [{ code: 'MISSING_METADATA', id: 'gone' }],
        })
        expect(
            result.current.getDataItemCompatibility('gone', {
                periods: ['202501'],
            }).status
        ).toBe('unknown')
    })

    it('gives the error of a failed request', async () => {
        const { result } = renderProfiles(
            [MONTHLY],
            createData({
                dataElements: () => Promise.reject(new Error('offline')),
            })
        )

        await waitFor(() => expect(result.current.loading).toBe(false))

        expect(result.current.error.message).toBe('offline')
        expect(result.current.profiles).toBeUndefined()
    })

    it('sends nothing without items', () => {
        const data = createData()
        const { result } = renderProfiles([], data)

        expect(result.current).toMatchObject({
            loading: false,
            profiles: undefined,
        })
        expect(data.dataElements).not.toHaveBeenCalled()
    })

    it('sends nothing again for the same items in a new array', async () => {
        const data = createData()
        const { result, rerender } = renderProfiles([MONTHLY], data)

        await waitFor(() => expect(result.current.profiles).toBeDefined())
        rerender([{ ...MONTHLY }])

        expect(result.current.loading).toBe(false)
        expect(data.dataElements).toHaveBeenCalledTimes(1)
    })

    it('loads again when the items change, and drops a stale answer', async () => {
        const { result, rerender } = renderProfiles([MONTHLY])

        rerender([WEEKLY])

        await waitFor(() =>
            expect(result.current.profiles?.weekly).toBeDefined()
        )

        expect(result.current.profiles.monthly).toBeUndefined()
    })

    it('ignores a failure that came after the items changed', async () => {
        let rejectFirst
        const data = createData({
            dataElements: jest
                .fn()
                .mockImplementationOnce(
                    () =>
                        new Promise((_, reject) => {
                            rejectFirst = reject
                        })
                )
                .mockImplementation(byIdFilter('dataElements')),
        })
        const { result, rerender } = renderProfiles([MONTHLY], data)

        await waitFor(() => expect(rejectFirst).toBeDefined())
        rerender([WEEKLY])
        await waitFor(() =>
            expect(result.current.profiles?.weekly).toBeDefined()
        )
        await act(async () => rejectFirst(new Error('late')))

        expect(result.current.error).toBeUndefined()
    })

    it('passes the server version: 2.40 has no QuarterlyNov', async () => {
        mockConfig = { systemInfo: {}, serverVersion: { major: 2, minor: 40 } }
        const { result } = renderProfiles([MONTHLY])

        await waitFor(() => expect(result.current.profiles).toBeDefined())

        expect(
            result.current.getDataItemCompatibility('monthly', {
                periods: ['2025NovQ1'],
            }).status
        ).toBe('unknown')
        expect(
            result.current.getDataItemCompatibility('monthly', {
                periods: ['2025Q1'],
            }).status
        ).toBe('full')
    })

    it('uses the system calendar', async () => {
        mockConfig = { systemInfo: { calendar: 'nepali' } }
        const { result } = renderProfiles([MONTHLY])

        await waitFor(() => expect(result.current.profiles).toBeDefined())

        expect(
            result.current.getDataItemCompatibility('monthly', {
                periods: ['2081Q1'],
            }).periods[0].alignsWithData
        ).toBe(true)
    })

    it('uses the calendar it is given', async () => {
        const { result } = renderProfiles([MONTHLY], createData(), {
            calendar: 'nepali',
        })

        await waitFor(() => expect(result.current.profiles).toBeDefined())

        expect(
            result.current.getDataItemCompatibility('monthly', {
                periods: ['2081Q1'],
            }).periods[0].alignsWithData
        ).toBe(true)
    })
})
