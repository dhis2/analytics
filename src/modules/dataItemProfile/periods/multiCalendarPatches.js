import { formatDate } from './calendarDates.js'

/* Workarounds for multi-calendar-dates 1.3.2, to remove once it is fixed
 * upstream. November period types name the year they end in: 2025Nov is
 * November 2024 to October 2025, 2025NovQ1 November 2024 to January 2025.
 * The library can't read the quarters and six-months ids, gives them ids the
 * server doesn't know (2024NovemberQ1), and puts 2025Nov a year late. Only the
 * ISO calendar is patched. */

const NOVEMBER_PERIOD_ID = /^(\d{4})Nov(?:(Q)([1-4])|(S)([12]))?$/

const NOVEMBER_PERIOD_TYPES = {
    FinancialNov: { idPart: '', months: 12 },
    QuarterlyNov: { idPart: 'Q', months: 3 },
    SixMonthlyNov: { idPart: 'S', months: 6 },
}

export const isNovemberPeriodId = (periodId) =>
    NOVEMBER_PERIOD_ID.test(periodId)

const NOVEMBER_PERIOD_TYPE_NAMES = new Set(Object.keys(NOVEMBER_PERIOD_TYPES))

export const isNovemberPeriodType = (periodType) =>
    NOVEMBER_PERIOD_TYPE_NAMES.has(periodType)

const toDateString = (date) =>
    formatDate({
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
    })

export const getNovemberPeriodDates = (periodId) => {
    const [, year, quarter, quarterNumber, sixMonths, sixMonthsNumber] =
        periodId.match(NOVEMBER_PERIOD_ID)
    const idPart = quarter ?? sixMonths ?? ''
    const number = quarterNumber ?? sixMonthsNumber
    const { months } = Object.values(NOVEMBER_PERIOD_TYPES).find(
        (type) => type.idPart === idPart
    )
    const firstMonth = 10 + (Number(number ?? 1) - 1) * months
    const start = new Date(Date.UTC(Number(year) - 1, firstMonth, 1))
    const end = new Date(Date.UTC(Number(year) - 1, firstMonth + months, 0))

    return { startDate: toDateString(start), endDate: toDateString(end) }
}

// The November period that holds an ISO date
export const getNovemberPeriodByDate = (periodType, date) => {
    const { idPart, months } = NOVEMBER_PERIOD_TYPES[periodType]
    const [year, month] = date.split('-').map(Number)
    const endYear = month >= 11 ? year + 1 : year
    const monthsSinceNovember = (month + 1) % 12
    const number = Math.floor(monthsSinceNovember / months) + 1
    const id = `${endYear}Nov${idPart && idPart + number}`

    return { id, ...getNovemberPeriodDates(id) }
}
