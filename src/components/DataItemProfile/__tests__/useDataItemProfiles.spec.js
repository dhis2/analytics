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
            dataSetElements: [
                { dataSet: { id: 'formMonthly', periodType: 'Monthly' } },
            ],
        },
        weekly: {
            aggregationType: 'SUM',
            dataSetElements: [
                { dataSet: { id: 'formWeeklyA', periodType: 'Weekly' } },
            ],
        },
        population: {
            aggregationType: 'AVERAGE',
            // An object, as some versions send it
            dataSetElements: [
                {
                    dataSet: {
                        id: 'formYearlyA',
                        periodType: { name: 'Yearly' },
                    },
                },
            ],
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

const isAssignedCount = ({ filter }) =>
    filter.some((condition) => condition.startsWith('dataSets.id'))

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
    // Counts with pageSize=1: 3 org units, 2 of them assigned the data set
    organisationUnits: (type, { params }) =>
        params.pageSize === 1
            ? { pager: { total: isAssignedCount(params) ? 2 : 3 } }
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
            assignedPeriodTypes: { shortestDirectType: 'Monthly' },
        })
        expect(result.current.profiles.coverage).toMatchObject({
            assignedPeriodTypes: {
                types: ['Monthly', 'Yearly'],
                shortestDirectType: 'Yearly',
                hasSeveral: true,
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
        const assigned = [{ id: 'assigned', dimensionItemType: 'DATA_ELEMENT' }]
        const resultAt = async (options) => {
            const { result } = renderProfiles(assigned, createData(), {
                orgUnits: ['nationUnit1'],
                ...options,
            })

            await waitFor(() =>
                expect(result.current.orgUnitCoverage).toBeDefined()
            )
            expect(result.current.loading).toBe(false)

            return result.current.getDataItemCompatibility('assigned', {
                orgUnits: ['nationUnit1'],
            }).orgUnits[0]
        }

        expect(await resultAt()).toEqual({
            id: 'nationUnit1',
            status: 'full',
            reasons: [],
            assignment: { assigned: 2, level: 1 },
        })
        expect(await resultAt({ withAssignmentTotals: true })).toEqual({
            id: 'nationUnit1',
            status: 'full',
            reasons: ['PARTLY_ASSIGNED'],
            assignment: { assigned: 2, total: 3, level: 1 },
        })
    })

    it('gives profiles their assigned org unit levels once org units are loaded', async () => {
        const assigned = [{ id: 'assigned', dimensionItemType: 'DATA_ELEMENT' }]
        const withoutOrgUnits = renderProfiles(assigned)

        await waitFor(() =>
            expect(withoutOrgUnits.result.current.profiles).toBeDefined()
        )

        expect(
            withoutOrgUnits.result.current.profiles.assigned
                .assignedOrgUnitLevels
        ).toBeUndefined()

        const withOrgUnits = renderProfiles(assigned, createData(), {
            orgUnits: ['nationUnit1'],
        })

        await waitFor(() =>
            expect(withOrgUnits.result.current.orgUnitCoverage).toBeDefined()
        )

        expect(
            withOrgUnits.result.current.profiles.assigned.assignedOrgUnitLevels
        ).toEqual({
            levels: [1],
            deepestLevel: 1,
            hasSeveral: false,
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
        const data = createData({
            'systemSettings/analyticsWeeklyStart': () =>
                Promise.reject(
                    Object.assign(new Error('Setting does not exist'), {
                        details: { httpStatusCode: 404 },
                    })
                ),
        })
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

    it('sends nothing without items, but the settings', async () => {
        const data = createData()
        const { result } = renderProfiles([], data)

        expect(result.current).toMatchObject({
            loading: false,
            profiles: undefined,
        })

        await waitFor(() =>
            expect(result.current.relativePeriodTypes.weeklyPeriodType).toBe(
                'Weekly'
            )
        )

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

    it('keeps the loaded profiles while new items load, and fetches only those', async () => {
        const data = createData()
        const { result, rerender } = renderProfiles([MONTHLY], data)

        await waitFor(() => expect(result.current.profiles).toBeDefined())

        const monthlyProfile = result.current.profiles.monthly

        rerender([MONTHLY, WEEKLY])

        expect(result.current.loading).toBe(true)
        expect(result.current.profiles).toEqual({ monthly: monthlyProfile })

        await waitFor(() =>
            expect(result.current.profiles?.weekly).toMatchObject({
                unknown: false,
            })
        )

        const filters = data.dataElements.mock.calls.map(
            ([, { params }]) => params.filter
        )

        expect(filters[1]).toContain('weekly')
        expect(filters[1]).not.toContain('monthly')
    })

    it('fetches the settings once', async () => {
        const settings = jest.fn(() => ({ analyticsWeeklyStart: 'WEEKLY' }))
        const { result, rerender } = renderProfiles(
            [MONTHLY],
            createData({ 'systemSettings/analyticsWeeklyStart': settings })
        )

        await waitFor(() => expect(result.current.profiles).toBeDefined())
        rerender([WEEKLY])
        await waitFor(() =>
            expect(result.current.profiles?.weekly).toBeDefined()
        )

        expect(settings).toHaveBeenCalledTimes(1)
    })

    it('gives the error of a failed setting request', async () => {
        const { result } = renderProfiles(
            [MONTHLY],
            createData({
                'systemSettings/analyticsWeeklyStart': () =>
                    Promise.reject(new Error('Unauthorized')),
            })
        )

        await waitFor(() => expect(result.current.error).toBeDefined())

        expect(result.current.error.message).toBe('Unauthorized')
    })

    it('gives the same result for the same selection', async () => {
        const { result } = renderProfiles([MONTHLY])

        await waitFor(() => expect(result.current.profiles).toBeDefined())

        const check = () =>
            result.current.getDataItemCompatibility('monthly', {
                periods: ['202501'],
            })

        expect(check()).toBe(check())
    })

    it('gives no coverage of earlier org units while new ones load', async () => {
        const { result, rerender } = renderHook(
            ({ orgUnits }) =>
                useDataItemProfiles(
                    [{ id: 'assigned', dimensionItemType: 'DATA_ELEMENT' }],
                    { orgUnits }
                ),
            {
                initialProps: { orgUnits: ['nationUnit1'] },
                wrapper: createWrapper(createData()),
            }
        )

        await waitFor(() =>
            expect(result.current.orgUnitCoverage).toBeDefined()
        )

        rerender({ orgUnits: ['LEVEL-1'] })

        expect(result.current.orgUnitCoverage).toBeUndefined()

        await waitFor(() =>
            expect(result.current.orgUnitCoverage).toBeDefined()
        )

        expect(
            result.current.orgUnitCoverage.orgUnits.nationUnit1
        ).toBeDefined()
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
