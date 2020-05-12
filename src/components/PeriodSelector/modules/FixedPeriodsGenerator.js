import i18n from '@dhis2/d2-i18n'
// generatePeriods config object: { boolean offset, boolean filterFuturePeriods, boolean reversePeriods }

export const MONTHLY = 'Monthly'

const getMonthName = key => {
    const monthNames = [
        i18n.t('January'),
        i18n.t('February'),
        i18n.t('March'),
        i18n.t('April'),
        i18n.t('May'),
        i18n.t('June'),
        i18n.t('July'),
        i18n.t('August'),
        i18n.t('September'),
        i18n.t('October'),
        i18n.t('November'),
        i18n.t('December'),
    ]

    return monthNames[key]
}

function DailyPeriodType(formatYyyyMmDd, fnFilter) {
    this.generatePeriods = config => {
        let periods = []
        const offset = parseInt(config.offset, 10)
        const isFilter = config.filterFuturePeriods
        const isReverse = config.reversePeriods
        const year = new Date(Date.now()).getFullYear() + offset
        const date = new Date(`01 Jan ${year}`)

        while (date.getFullYear() === year) {
            const period = {}
            period.startDate = formatYyyyMmDd(date)
            period.endDate = period.startDate
            period.name = () => period.startDate
            period.iso = period.startDate.replace(/-/g, '')
            period.id = period.iso
            periods.push(period)
            date.setDate(date.getDate() + 1)
        }

        periods = isFilter ? fnFilter(periods) : periods
        periods = isReverse ? periods.reverse() : periods

        return periods
    }
}

function WeeklyPeriodType(formatYyyyMmDd, weekObj, fnFilter) {
    // Calculate the first date of an EPI year base on ISO standard  ( first week always contains 4th Jan )
    const getEpiWeekStartDay = (year, startDayOfWeek) => {
        const jan4 = new Date(year, 0, 4)
        const jan4DayOfWeek = jan4.getDay()
        const startDate = jan4
        const dayDiff = jan4DayOfWeek - startDayOfWeek

        if (dayDiff > 0) {
            startDate.setDate(jan4.getDate() - dayDiff)
        } else if (dayDiff < 0) {
            startDate.setDate(jan4.getDate() - dayDiff)
            startDate.setDate(startDate.getDate() - 7)
        }

        return startDate
    }

    this.generatePeriods = config => {
        let periods = []
        const offset = parseInt(config.offset, 10)
        const isFilter = config.filterFuturePeriods
        const isReverse = config.reversePeriods
        const year = new Date(Date.now()).getFullYear() + offset
        const date = getEpiWeekStartDay(year, weekObj.startDay)
        let week = 1

        while (date.getFullYear() <= year) {
            const period = {}
            period.startDate = formatYyyyMmDd(date)
            period.iso = `${year}${weekObj.shortName}W${week}`
            period.id = period.iso
            date.setDate(date.getDate() + 6)
            period.endDate = formatYyyyMmDd(date)

            const weekNumber = week
            period.name = () =>
                `${i18n.t('Week {{weekNumber}}', { weekNumber })} - ${
                    period.startDate
                } - ${period.endDate}`

            // if end date is Jan 4th or later, week belongs to next year
            if (date.getFullYear() > year && date.getDate() >= 4) {
                break
            }

            periods.push(period)
            date.setDate(date.getDate() + 1)

            week += 1
        }

        periods = isFilter ? fnFilter(periods) : periods
        periods = isReverse ? periods.reverse() : periods

        return periods
    }
}

function BiWeeklyPeriodType(formatYyyyMmDd, fnFilter) {
    this.generatePeriods = config => {
        let periods = []
        const offset = parseInt(config.offset, 10)
        const isFilter = config.filterFuturePeriods
        const isReverse = config.reversePeriods
        const year = new Date(Date.now()).getFullYear() + offset
        const date = new Date(`01 Jan ${year}`)
        const day = date.getDay()
        let biWeek = 1

        if (day <= 4) {
            date.setDate(date.getDate() - (day - 1))
        } else {
            date.setDate(date.getDate() + (8 - day))
        }

        while (date.getFullYear() <= year) {
            const period = {}

            period.iso = `${year}BiW${biWeek}`
            period.id = period.iso
            period.startDate = formatYyyyMmDd(date)
            date.setDate(date.getDate() + 13)

            period.endDate = formatYyyyMmDd(date)
            const biWeekNumber = biWeek
            period.name = () =>
                `${i18n.t('Bi-Week {{biWeekNumber}}', { biWeekNumber })} - ${
                    period.startDate
                } - ${period.endDate}`

            // if end date is Jan 4th or later, biweek belongs to next year
            if (date.getFullYear() > year && date.getDate() >= 4) {
                break
            }

            periods.push(period)

            date.setDate(date.getDate() + 1)

            biWeek += 1
        }

        periods = isFilter ? fnFilter(periods) : periods
        periods = isReverse ? periods.reverse() : periods

        return periods
    }
}

function MonthlyPeriodType(formatYyyyMmDd, fnFilter) {
    const formatIso = date => {
        const y = date.getFullYear()
        let m = String(date.getMonth() + 1)

        m = m.length < 2 ? `0${m}` : m

        return y + m
    }

    this.generatePeriods = config => {
        let periods = []

        const offset = parseInt(config.offset, 10)
        const isFilter = config.filterFuturePeriods
        const isReverse = config.reversePeriods
        const year = new Date(Date.now()).getFullYear() + offset
        const date = new Date(`31 Dec ${year}`)

        while (date.getFullYear() === year) {
            const period = {}

            period.endDate = formatYyyyMmDd(date)
            date.setDate(1)
            period.startDate = formatYyyyMmDd(date)
            const monthName = getMonthName(date.getMonth())
            period.name = () => `${monthName} ${year}`
            period.iso = formatIso(date)
            period.id = period.iso

            periods.push(period)
            date.setDate(0)
        }

        periods = isFilter ? fnFilter(periods) : periods
        periods = isReverse ? periods : periods.reverse()
        // Months are collected backwards. If isReverse is true, then do nothing. Else reverse to correct order and return.

        return periods
    }
}

function BiMonthlyPeriodType(formatYyyyMmDd, fnFilter) {
    this.generatePeriods = config => {
        let periods = []
        const offset = parseInt(config.offset, 10)
        const isFilter = config.filterFuturePeriods
        const isReverse = config.reversePeriods
        const year = new Date(Date.now()).getFullYear() + offset
        const date = new Date(`31 Dec ${year}`)
        let index = 6

        while (date.getFullYear() === year) {
            const period = {}

            period.endDate = formatYyyyMmDd(date)
            date.setDate(0)
            date.setDate(1)
            period.startDate = formatYyyyMmDd(date)
            const monthStart = getMonthName(date.getMonth())
            const monthEnd = getMonthName(date.getMonth() + 1)
            const fullYear = date.getFullYear()
            period.name = () => `${monthStart} - ${monthEnd} ${fullYear}`
            period.iso = `${year}0${index}B`
            period.id = period.iso
            periods.push(period)
            date.setDate(0)

            index--
        }

        periods = isFilter ? fnFilter(periods) : periods
        periods = isReverse ? periods : periods.reverse()
        // Bi-months are collected backwards. If isReverse is true, then do nothing. Else reverse to correct order and return.

        return periods
    }
}

function QuarterlyPeriodType(formatYyyyMmDd, fnFilter) {
    this.generatePeriods = config => {
        let periods = []
        const offset = parseInt(config.offset, 10)
        const isFilter = config.filterFuturePeriods
        const isReverse = config.reversePeriods
        const year = new Date(Date.now()).getFullYear() + offset
        const date = new Date(`31 Dec ${year}`)
        let quarter = 4

        while (date.getFullYear() === year) {
            const period = {}
            period.endDate = formatYyyyMmDd(date)
            date.setDate(0)
            date.setDate(0)
            date.setDate(1)
            period.startDate = formatYyyyMmDd(date)
            const monthStart = getMonthName(date.getMonth())
            const monthEnd = getMonthName(date.getMonth() + 2)
            const fullYear = date.getFullYear()
            period.name = () => `${monthStart} - ${monthEnd} ${fullYear}`
            period.iso = `${year}Q${quarter}`
            period.id = period.iso
            periods.push(period)
            date.setDate(0)
            quarter -= 1
        }

        periods = isFilter ? fnFilter(periods) : periods
        periods = isReverse ? periods : periods.reverse()
        // Quarters are collected backwards. If isReverse is true, then do nothing. Else reverse to correct order and return.

        return periods
    }
}

function SixMonthlyPeriodType(fnFilter) {
    this.generatePeriods = config => {
        let periods = []
        const offset = parseInt(config.offset, 10)
        const isFilter = config.filterFuturePeriods
        const isReverse = config.reversePeriods
        const year = new Date(Date.now()).getFullYear() + offset

        let period = {}
        period.startDate = `${year}-01-01`
        period.endDate = `${year}-06-30`
        period.name = () => `${getMonthName(0)} - ${getMonthName(5)} ${year}`
        period.iso = `${year}S1`
        period.id = period.iso
        periods.push(period)

        period = {}
        period.startDate = `${year}-07-01`
        period.endDate = `${year}-12-31`
        period.name = () => `${getMonthName(6)} - ${getMonthName(11)} ${year}`
        period.iso = `${year}S2`
        period.id = period.iso
        periods.push(period)

        periods = isFilter ? fnFilter(periods) : periods
        periods = isReverse ? periods.reverse() : periods

        return periods
    }
}

function SixMonthlyAprilPeriodType(fnFilter) {
    this.generatePeriods = config => {
        let periods = []
        const offset = parseInt(config.offset, 10)
        const isFilter = config.filterFuturePeriods
        const isReverse = config.reversePeriods
        const year = new Date(Date.now()).getFullYear() + offset

        let period = {}
        period.startDate = `${year}-04-01`
        period.endDate = `${year}-09-30`
        period.name = () => `${getMonthName(3)} - ${getMonthName(8)} ${year}`
        period.iso = `${year}AprilS1`
        period.id = period.iso
        periods.push(period)

        period = {}
        period.startDate = `${year}-10-01`
        period.endDate = `${year + 1}-03-31`
        period.name = () =>
            `${getMonthName(9)} ${year} - ${getMonthName(2)} ${year + 1}`
        period.iso = `${year}AprilS2`
        period.id = period.iso
        periods.push(period)

        periods = isFilter ? fnFilter(periods) : periods
        periods = isReverse ? periods.reverse() : periods

        return periods
    }
}

function YearlyPeriodType(formatYyyyMmDd, fnFilter) {
    this.generatePeriods = config => {
        let periods = []
        const offset = parseInt(config.offset, 10)
        const isFilter = config.filterFuturePeriods
        const isReverse = config.reversePeriods
        const year = new Date(Date.now()).getFullYear() + offset
        const date = new Date(`31 Dec ${year}`)

        while (year - date.getFullYear() < 10) {
            const period = {}
            period.endDate = formatYyyyMmDd(date)
            date.setMonth(0, 1)
            period.startDate = formatYyyyMmDd(date)
            const dateString = date.getFullYear().toString()
            period.name = () => dateString
            period.iso = date.getFullYear().toString()
            period.id = period.iso.toString()
            periods.push(period)
            date.setDate(0)
        }

        periods = isFilter ? fnFilter(periods) : periods
        periods = isReverse ? periods : periods.reverse()
        // Years are collected backwards. If isReverse is true, then do nothing. Else reverse to correct order and return.

        return periods
    }
}

function FinancialOctoberPeriodType(formatYyyyMmDd, fnFilter) {
    this.generatePeriods = config => {
        let periods = []
        const offset = parseInt(config.offset, 10)
        const isFilter = config.filterFuturePeriods
        const isReverse = config.reversePeriods
        const year = new Date(Date.now()).getFullYear() + offset
        const date = new Date(`30 Sep ${year + 1}`)

        for (let i = 0; i < 10; i++) {
            const period = {}
            period.endDate = formatYyyyMmDd(date)
            date.setYear(date.getFullYear() - 1)
            date.setDate(date.getDate() + 1)
            period.startDate = formatYyyyMmDd(date)
            const yearStart = date.getFullYear()
            const yearEnd = date.getFullYear() + 1
            period.name = () =>
                `${getMonthName(9)} ${yearStart} - ${getMonthName(
                    8
                )} ${yearEnd}`
            period.id = `${date.getFullYear()}Oct`
            periods.push(period)
            date.setDate(date.getDate() - 1)
        }

        periods = isFilter ? fnFilter(periods) : periods
        periods = isReverse ? periods : periods.reverse()
        // FinancialOctober periods are collected backwards. If isReverse is true, then do nothing. Else reverse to correct order and return.

        return periods
    }
}

function FinancialNovemberPeriodType(formatYyyyMmDd, fnFilter) {
    this.generatePeriods = config => {
        let periods = []
        const offset = parseInt(config.offset, 10)
        const isFilter = config.filterFuturePeriods
        const isReverse = config.reversePeriods
        const year = new Date(Date.now()).getFullYear() + offset
        const date = new Date(`31 Oct ${year + 1}`)

        for (let i = 0; i < 10; i++) {
            const period = {}
            period.endDate = formatYyyyMmDd(date)
            date.setYear(date.getFullYear() - 1)
            date.setDate(date.getDate() + 1)
            period.startDate = formatYyyyMmDd(date)
            const yearStart = date.getFullYear()
            const yearEnd = date.getFullYear() + 1
            period.name = () =>
                `${getMonthName(10)} ${yearStart} - ${getMonthName(
                    9
                )} ${yearEnd}`
            period.id = `${date.getFullYear()}Nov`
            periods.push(period)
            date.setDate(date.getDate() - 1)
        }

        periods = isFilter ? fnFilter(periods) : periods
        periods = isReverse ? periods : periods.reverse()
        // FinancialNovember periods are collected backwards. If isReverse is true, then do nothing. Else reverse to correct order and return.

        return periods
    }
}

function FinancialJulyPeriodType(formatYyyyMmDd, fnFilter) {
    this.generatePeriods = config => {
        let periods = []
        const offset = parseInt(config.offset, 10)
        const isFilter = config.filterFuturePeriods
        const isReverse = config.reversePeriods
        const year = new Date(Date.now()).getFullYear() + offset
        const date = new Date(`30 Jun ${year + 1}`)

        for (let i = 0; i < 10; i++) {
            const period = {}
            period.endDate = formatYyyyMmDd(date)
            date.setYear(date.getFullYear() - 1)
            date.setDate(date.getDate() + 1)
            period.startDate = formatYyyyMmDd(date)
            const yearStart = date.getFullYear()
            const yearEnd = date.getFullYear() + 1
            period.name = () =>
                `${getMonthName(6)} ${yearStart} - ${getMonthName(
                    5
                )} ${yearEnd}`
            period.id = `${date.getFullYear()}July`
            periods.push(period)
            date.setDate(date.getDate() - 1)
        }

        periods = isFilter ? fnFilter(periods) : periods
        periods = isReverse ? periods : periods.reverse()
        // FinancialJuly periods are collected backwards. If isReverse is true, then do nothing. Else reverse to correct order and return.

        return periods
    }
}

function FinancialAprilPeriodType(formatYyyyMmDd, fnFilter) {
    this.generatePeriods = config => {
        let periods = []
        const offset = parseInt(config.offset, 10)
        const isFilter = config.filterFuturePeriods
        const isReverse = config.reversePeriods
        const year = new Date(Date.now()).getFullYear() + offset
        const date = new Date(`31 Mar ${year + 1}`)

        for (let i = 0; i < 10; i++) {
            const period = {}
            period.endDate = formatYyyyMmDd(date)
            date.setYear(date.getFullYear() - 1)
            date.setDate(date.getDate() + 1)
            period.startDate = formatYyyyMmDd(date)
            const yearStart = date.getFullYear()
            const yearEnd = date.getFullYear() + 1
            period.name = () =>
                `${getMonthName(3)} ${yearStart} - ${getMonthName(
                    2
                )} ${yearEnd}`
            period.id = `${date.getFullYear()}April`
            periods.push(period)
            date.setDate(date.getDate() - 1)
        }

        periods = isFilter ? fnFilter(periods) : periods
        periods = isReverse ? periods : periods.reverse()
        // FinancialApril periods are collected backwards. If isReverse is true, then do nothing. Else reverse to correct order and return.

        return periods
    }
}

function PeriodType() {
    const formatYyyyMmDd = date => {
        const y = date.getFullYear()
        let m = String(date.getMonth() + 1)
        let d = String(date.getDate())

        m = m.length < 2 ? `0${m}` : m
        d = d.length < 2 ? `0${d}` : d

        return `${y}-${m}-${d}`
    }

    const filterFuturePeriods = periods => {
        const array = []
        const now = new Date(Date.now())

        for (let i = 0; i < periods.length; i++) {
            if (new Date(periods[i].startDate) <= now) {
                array.push(periods[i])
            }
        }

        return array
    }

    const periodTypes = {}

    periodTypes.Daily = {
        generator: new DailyPeriodType(formatYyyyMmDd, filterFuturePeriods),
        name: () => i18n.t('Daily'),
    }
    periodTypes.Weekly = {
        generator: new WeeklyPeriodType(
            formatYyyyMmDd,
            { shortName: '', startDay: 1 },
            filterFuturePeriods
        ),
        name: () => i18n.t('Weekly'),
    }
    periodTypes['Bi-weekly'] = {
        generator: new BiWeeklyPeriodType(formatYyyyMmDd, filterFuturePeriods),
        name: () => i18n.t('Bi-weekly'),
    }
    periodTypes['Weekly (Start Wednesday)'] = {
        generator: new WeeklyPeriodType(
            formatYyyyMmDd,
            { shortName: 'Wed', startDay: 3 },
            filterFuturePeriods
        ),
        name: () => i18n.t('Weekly (Start Wednesday)'),
    }
    periodTypes['Weekly (Start Thursday)'] = {
        generator: new WeeklyPeriodType(
            formatYyyyMmDd,
            { shortName: 'Thu', startDay: 4 },
            filterFuturePeriods
        ),
        name: () => i18n.t('Weekly (Start Thursday)'),
    }
    periodTypes['Weekly (Start Saturday)'] = {
        generator: new WeeklyPeriodType(
            formatYyyyMmDd,
            { shortName: 'Sat', startDay: 6 },
            filterFuturePeriods
        ),
        name: () => i18n.t('Weekly (Start Saturday)'),
    }
    periodTypes['Weekly (Start Sunday)'] = {
        generator: new WeeklyPeriodType(
            formatYyyyMmDd,
            { shortName: 'Sun', startDay: 7 },
            filterFuturePeriods
        ),
        name: () => i18n.t('Weekly (Start Sunday)'),
    }
    periodTypes[MONTHLY] = {
        generator: new MonthlyPeriodType(formatYyyyMmDd, filterFuturePeriods),
        name: () => i18n.t('Monthly'),
    }
    periodTypes['Bi-monthly'] = {
        generator: new BiMonthlyPeriodType(formatYyyyMmDd, filterFuturePeriods),
        name: () => i18n.t('Bi-monthly'),
    }
    periodTypes.Quarterly = {
        generator: new QuarterlyPeriodType(formatYyyyMmDd, filterFuturePeriods),
        name: () => i18n.t('Quarterly'),
    }
    periodTypes['Six-monthly'] = {
        generator: new SixMonthlyPeriodType(filterFuturePeriods),
        name: () => i18n.t('Six-monthly'),
    }
    periodTypes['Six-monthly April'] = {
        generator: new SixMonthlyAprilPeriodType(filterFuturePeriods),
        name: () => i18n.t('Six-monthly April'),
    }
    periodTypes.Yearly = {
        generator: new YearlyPeriodType(formatYyyyMmDd, filterFuturePeriods),
        name: () => i18n.t('Yearly'),
    }
    periodTypes['Financial year (Start November)'] = {
        generator: new FinancialNovemberPeriodType(
            formatYyyyMmDd,
            filterFuturePeriods
        ),
        name: () => i18n.t('Financial year (Start November)'),
    }
    periodTypes['Financial year (Start October)'] = {
        generator: new FinancialOctoberPeriodType(
            formatYyyyMmDd,
            filterFuturePeriods
        ),
        name: () => i18n.t('Financial year (Start October)'),
    }
    periodTypes['Financial year (Start July)'] = {
        generator: new FinancialJulyPeriodType(
            formatYyyyMmDd,
            filterFuturePeriods
        ),
        name: () => i18n.t('Financial year (Start July)'),
    }
    periodTypes['Financial year (Start April)'] = {
        generator: new FinancialAprilPeriodType(
            formatYyyyMmDd,
            filterFuturePeriods
        ),
        name: () => i18n.t('Financial year (Start April)'),
    }

    this.getOptions = () => periodTypes
    this.get = key => periodTypes[key].generator
}

export default PeriodType
