import i18n from '../../../locales/index.js'
import {
    DAILY,
    WEEKLY,
    WEEKLYWED,
    WEEKLYTHU,
    WEEKLYSAT,
    WEEKLYSUN,
    BIWEEKLY,
    MONTHLY,
    BIMONTHLY,
    QUARTERLY,
    SIXMONTHLY,
    SIXMONTHLYAPR,
    YEARLY,
    FYNOV,
    FYOCT,
    FYJUL,
    FYAPR,
} from './index.js'

const PERIOD_TYPE_REGEX = {
    [DAILY]: /^([0-9]{4})([0-9]{2})([0-9]{2})$/, // YYYYMMDD
    [WEEKLY]: /^([0-9]{4})()W([0-9]{1,2})$/, // YYYY"W"[1-53]
    [BIWEEKLY]: /^([0-9]{4})BiW([0-9]{1,2})$/, // YYYY"BiW"[1-27]
    [WEEKLYWED]: /^([0-9]{4})(Wed)W([0-9]{1,2})$/, // YYYY"WedW"[1-53]
    [WEEKLYTHU]: /^([0-9]{4})(Thu)W([0-9]{1,2})$/, // YYYY"ThuW"[1-53]
    [WEEKLYSAT]: /^([0-9]{4})(Sat)W([0-9]{1,2})$/, // YYYY"SatW"[1-53]
    [WEEKLYSUN]: /^([0-9]{4})(Sun)W([0-9]{1,2})$/, // YYYY"SunW"[1-53]
    [MONTHLY]: /^([0-9]{4})([0-9]{2})$/, // YYYYMM
    [BIMONTHLY]: /^([0-9]{4})([0-9]{2})B$/, // YYYY0[1-6]"B"
    [QUARTERLY]: /^([0-9]{4})Q([1234])$/, // YYYY"Q"[1-4]
    [SIXMONTHLY]: /^([0-9]{4})S([12])$/, // YYYY"S"[1/2]
    [SIXMONTHLYAPR]: /^([0-9]{4})AprilS([12])$/, // YYYY"AprilS"[1/2]
    // [SIXMONTHLYNOV]: /^([0-9]{4})NovS([12])$/, // YYYY"NovS"[1/2] Not supported?
    [YEARLY]: /^([0-9]{4})$/, // YYYY
    [FYNOV]: /^([0-9]{4})Nov$/, // YYYY"Nov"
    [FYOCT]: /^([0-9]{4})Oct$/, // YYYY"Oct"
    [FYJUL]: /^([0-9]{4})July$/, // YYYY"July"
    [FYAPR]: /^([0-9]{4})April$/, // YYYY"April"
}

const getMonthName = (key) => {
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

const getDailyPeriodType = (formatYyyyMmDd, fnFilter) => {
    return (config) => {
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
            period.name = period.startDate
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

const getWeeklyPeriodType = (formatYyyyMmDd, weekObj, fnFilter) => {
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

    return (config) => {
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
            period.name = `${i18n.t('Week {{weekNumber}}', { weekNumber })} - ${
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

const getBiWeeklyPeriodType = (formatYyyyMmDd, fnFilter) => {
    return (config) => {
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
            period.name = `${i18n.t('Bi-Week {{biWeekNumber}}', {
                biWeekNumber,
            })} - ${period.startDate} - ${period.endDate}`

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

const getMonthlyPeriodType = (formatYyyyMmDd, fnFilter) => {
    const formatIso = (date) => {
        const y = date.getFullYear()
        let m = String(date.getMonth() + 1)

        m = m.length < 2 ? `0${m}` : m

        return y + m
    }

    return (config) => {
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
            period.name = `${monthName} ${year}`
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

const getBiMonthlyPeriodType = (formatYyyyMmDd, fnFilter) => {
    return (config) => {
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
            period.name = `${monthStart} - ${monthEnd} ${fullYear}`
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

const getQuarterlyPeriodType = (formatYyyyMmDd, fnFilter) => {
    return (config) => {
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
            period.name = `${monthStart} - ${monthEnd} ${fullYear}`
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

const getSixMonthlyPeriodType = (fnFilter) => {
    return (config) => {
        let periods = []
        const offset = parseInt(config.offset, 10)
        const isFilter = config.filterFuturePeriods
        const isReverse = config.reversePeriods
        const year = new Date(Date.now()).getFullYear() + offset

        let period = {}
        period.startDate = `${year}-01-01`
        period.endDate = `${year}-06-30`
        period.name = `${getMonthName(0)} - ${getMonthName(5)} ${year}`
        period.iso = `${year}S1`
        period.id = period.iso
        periods.push(period)

        period = {}
        period.startDate = `${year}-07-01`
        period.endDate = `${year}-12-31`
        period.name = `${getMonthName(6)} - ${getMonthName(11)} ${year}`
        period.iso = `${year}S2`
        period.id = period.iso
        periods.push(period)

        periods = isFilter ? fnFilter(periods) : periods
        periods = isReverse ? periods.reverse() : periods

        return periods
    }
}

const getSixMonthlyAprilPeriodType = (fnFilter) => {
    return (config) => {
        let periods = []
        const offset = parseInt(config.offset, 10)
        const isFilter = config.filterFuturePeriods
        const isReverse = config.reversePeriods
        const year = new Date(Date.now()).getFullYear() + offset

        let period = {}
        period.startDate = `${year}-04-01`
        period.endDate = `${year}-09-30`
        period.name = `${getMonthName(3)} - ${getMonthName(8)} ${year}`
        period.iso = `${year}AprilS1`
        period.id = period.iso
        periods.push(period)

        period = {}
        period.startDate = `${year}-10-01`
        period.endDate = `${year + 1}-03-31`
        period.name = `${getMonthName(9)} ${year} - ${getMonthName(2)} ${
            year + 1
        }`
        period.iso = `${year}AprilS2`
        period.id = period.iso
        periods.push(period)

        periods = isFilter ? fnFilter(periods) : periods
        periods = isReverse ? periods.reverse() : periods

        return periods
    }
}

const getYearlyPeriodType = (formatYyyyMmDd, fnFilter) => {
    return (config) => {
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
            period.name = dateString
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

const getFinancialOctoberPeriodType = (formatYyyyMmDd, fnFilter) => {
    return (config) => {
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
            period.name = `${getMonthName(9)} ${yearStart} - ${getMonthName(
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

const getFinancialNovemberPeriodType = (formatYyyyMmDd, fnFilter) => {
    return (config) => {
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
            period.name = `${getMonthName(10)} ${yearStart} - ${getMonthName(
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

const getFinancialJulyPeriodType = (formatYyyyMmDd, fnFilter) => {
    return (config) => {
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
            period.name = `${getMonthName(6)} ${yearStart} - ${getMonthName(
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

const getFinancialAprilPeriodType = (formatYyyyMmDd, fnFilter) => {
    return (config) => {
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
            period.name = `${getMonthName(3)} ${yearStart} - ${getMonthName(
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

const formatYyyyMmDd = (date) => {
    const y = date.getFullYear()
    let m = String(date.getMonth() + 1)
    let d = String(date.getDate())

    m = m.length < 2 ? `0${m}` : m
    d = d.length < 2 ? `0${d}` : d

    return `${y}-${m}-${d}`
}

const filterFuturePeriods = (periods) => {
    const array = []
    const now = new Date(Date.now())

    for (let i = 0; i < periods.length; i++) {
        if (new Date(periods[i].startDate) <= now) {
            array.push(periods[i])
        }
    }

    return array
}

const getOptions = () => [
    {
        id: DAILY,
        getPeriods: getDailyPeriodType(formatYyyyMmDd, filterFuturePeriods),
        name: i18n.t('Daily'),
    },
    {
        id: WEEKLY,
        getPeriods: getWeeklyPeriodType(
            formatYyyyMmDd,
            { shortName: '', startDay: 1 },
            filterFuturePeriods
        ),
        name: i18n.t('Weekly'),
    },
    {
        id: WEEKLYWED,
        getPeriods: getWeeklyPeriodType(
            formatYyyyMmDd,
            { shortName: 'Wed', startDay: 3 },
            filterFuturePeriods
        ),
        name: i18n.t('Weekly (Start Wednesday)'),
    },
    {
        id: WEEKLYTHU,
        getPeriods: getWeeklyPeriodType(
            formatYyyyMmDd,
            { shortName: 'Thu', startDay: 4 },
            filterFuturePeriods
        ),
        name: i18n.t('Weekly (Start Thursday)'),
    },
    {
        id: WEEKLYSAT,
        getPeriods: getWeeklyPeriodType(
            formatYyyyMmDd,
            { shortName: 'Sat', startDay: 6 },
            filterFuturePeriods
        ),
        name: i18n.t('Weekly (Start Saturday)'),
    },
    {
        id: WEEKLYSUN,
        getPeriods: getWeeklyPeriodType(
            formatYyyyMmDd,
            { shortName: 'Sun', startDay: 7 },
            filterFuturePeriods
        ),
        name: i18n.t('Weekly (Start Sunday)'),
    },
    {
        id: BIWEEKLY,
        getPeriods: getBiWeeklyPeriodType(formatYyyyMmDd, filterFuturePeriods),
        name: i18n.t('Bi-weekly'),
    },
    {
        id: MONTHLY,
        getPeriods: getMonthlyPeriodType(formatYyyyMmDd, filterFuturePeriods),
        name: i18n.t('Monthly'),
    },
    {
        id: BIMONTHLY,
        getPeriods: getBiMonthlyPeriodType(formatYyyyMmDd, filterFuturePeriods),
        name: i18n.t('Bi-monthly'),
    },
    {
        id: QUARTERLY,
        getPeriods: getQuarterlyPeriodType(formatYyyyMmDd, filterFuturePeriods),
        name: i18n.t('Quarterly'),
    },
    {
        id: SIXMONTHLY,
        getPeriods: getSixMonthlyPeriodType(filterFuturePeriods),
        name: i18n.t('Six-monthly'),
    },
    {
        id: SIXMONTHLYAPR,
        getPeriods: getSixMonthlyAprilPeriodType(filterFuturePeriods),
        name: i18n.t('Six-monthly April'),
    },
    {
        id: YEARLY,
        getPeriods: getYearlyPeriodType(formatYyyyMmDd, filterFuturePeriods),
        name: i18n.t('Yearly'),
    },
    {
        id: FYNOV,
        getPeriods: getFinancialNovemberPeriodType(
            formatYyyyMmDd,
            filterFuturePeriods
        ),
        name: i18n.t('Financial year (Start November)'),
    },
    {
        id: FYOCT,
        getPeriods: getFinancialOctoberPeriodType(
            formatYyyyMmDd,
            filterFuturePeriods
        ),
        name: i18n.t('Financial year (Start October)'),
    },
    {
        id: FYJUL,
        getPeriods: getFinancialJulyPeriodType(
            formatYyyyMmDd,
            filterFuturePeriods
        ),
        name: i18n.t('Financial year (Start July)'),
    },
    {
        id: FYAPR,
        getPeriods: getFinancialAprilPeriodType(
            formatYyyyMmDd,
            filterFuturePeriods
        ),
        name: i18n.t('Financial year (Start April)'),
    },
]

export const getFixedPeriodsOptionsById = (id) =>
    getOptions().find((option) => option.id === id)

export const getFixedPeriodsOptions = () => getOptions()

export const getYearOffsetFromNow = (yearStr) =>
    parseInt(yearStr) - new Date(Date.now()).getFullYear()

export const parsePeriodCode = (code, allowedTypes) => {
    const periodTypes = Object.keys(PERIOD_TYPE_REGEX)
    let i = 0
    let type = undefined
    let match = undefined

    while (i < periodTypes.length && !match) {
        type = periodTypes[i]
        match = code.match(PERIOD_TYPE_REGEX[type])
        i++
    }

    if (
        !match ||
        (Array.isArray(allowedTypes) && !allowedTypes.some((t) => t === type))
    ) {
        return undefined
    }

    const period = getFixedPeriodsOptionsById(type)
    const offset = getYearOffsetFromNow(match[1])
    const options = period.getPeriods({ offset })

    return {
        id: period.id,
        name: period.name,
        year: match[1],
        options,
    }
}
