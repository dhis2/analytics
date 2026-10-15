/**
 * Regression snapshots for every use of @dhis2/multi-calendar-dates in the
 * library: getNowInCalendar and generateFixedPeriods, through
 * getFixedPeriodsOptionsById (fixedPeriods.js) and the default year and
 * period list in PeriodTransfer.
 *
 * The snapshots were taken against @dhis2/multi-calendar-dates 1.3.2 and are
 * used to verify behaviour after upgrading to 3.x. Calls that throw are
 * recorded as `{ error: message }` instead of being skipped.
 */
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import PeriodDimension from '../PeriodDimension.js'
import { getFixedPeriodsOptionsById } from '../utils/fixedPeriods.js'

let mockCalendar = 'gregory'

jest.mock('@dhis2/app-runtime', () => ({
    useConfig: () => ({
        systemInfo: { calendar: mockCalendar },
        serverVersion: { minor: 42 },
    }),
    useDataQuery: jest.fn().mockImplementation((_query, options) => {
        if (options?.lazy) {
            return {
                data: null,
                error: undefined,
                loading: false,
                refetch: jest.fn(),
            }
        }
        return { data: { userSettings: { keyUiLocale: 'en' } } }
    }),
}))

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

const capture = (fn) => {
    try {
        return fn()
    } catch (error) {
        return { error: error.message }
    }
}

const CALENDARS = ['gregory', 'ethiopian', 'nepali', 'islamic']

// Mid-year, just after the Ethiopic new year (11 September), and just after
// the Nepali new year (mid April)
const PINNED_TIMES = [
    '2024-06-15T10:30:00Z',
    '2024-09-12T10:30:00Z',
    '2025-04-14T10:30:00Z',
]

const PERIOD_TYPES = [
    'DAILY',
    'WEEKLY',
    'WEEKLYSUN',
    'BIWEEKLY',
    'MONTHLY',
    'BIMONTHLY',
    'QUARTERLY',
    'SIXMONTHLY',
    'SIXMONTHLYAPR',
    'YEARLY',
    'FYAPR',
    'FYJUL',
    'FYNOV',
]

const CONFIGS = {
    // the current year, without future periods (as the apps use it)
    currentYear: {
        offset: 0,
        filterFuturePeriods: true,
        reversePeriods: false,
    },
    // last year, reversed (as the fixed period selectors use it)
    lastYear: { offset: -1, filterFuturePeriods: false, reversePeriods: true },
}

// one line per period, and only the first and last two, to keep the
// snapshots readable
const summarisePeriods = (periods) => ({
    count: periods.length,
    first: periods.slice(0, 2).map((p) => JSON.stringify(p)),
    last: periods.slice(-2).map((p) => JSON.stringify(p)),
})

afterEach(() => {
    jest.useRealTimers()
})

describe.each(CALENDARS)('%s calendar', (calendar) => {
    describe.each(PINNED_TIMES)('now = %s', (pinnedTime) => {
        beforeEach(() => {
            jest.useFakeTimers()
            jest.setSystemTime(new Date(pinnedTime))
        })

        it('getFixedPeriodsOptionsById(...).getPeriods', () => {
            const result = {}

            for (const periodType of PERIOD_TYPES) {
                const option = getFixedPeriodsOptionsById(periodType, {
                    calendar,
                    locale: 'en',
                })

                result[periodType] = Object.fromEntries(
                    Object.entries(CONFIGS).map(([name, config]) => [
                        name,
                        capture(() =>
                            summarisePeriods(option.getPeriods(config))
                        ),
                    ])
                )
            }

            expect(result).toMatchSnapshot()
        })
    })

    it('PeriodTransfer shows the default year and its monthly periods', async () => {
        jest.useFakeTimers({ advanceTimers: true })
        jest.setSystemTime(new Date(PINNED_TIMES[0]))
        mockCalendar = calendar

        const user = userEvent.setup({
            advanceTimers: jest.advanceTimersByTime,
        })
        const result = capture(() =>
            render(
                <PeriodDimension
                    selectedPeriods={[]}
                    onSelect={jest.fn()}
                    rightFooter={<></>}
                />
            )
        )

        if (result.error) {
            expect(result).toMatchSnapshot()
            return
        }

        await user.click(screen.getByText('Fixed periods'))

        const year = within(
            screen.getByTestId('period-dimension-fixed-period-filter-year')
        ).getByRole('spinbutton').value
        const periods = screen
            .getAllByTestId(/period-dimension-transfer-option-/)
            .map((option) => option.textContent)

        expect({ year, periods }).toMatchSnapshot()
    })
})
