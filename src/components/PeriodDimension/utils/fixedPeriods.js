import {
    generateFixedPeriods,
    getNowInCalendar,
} from '@dhis2/multi-calendar-dates'
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

const getPeriods = ({ periodType, config, fnFilter, calendar }) => {
    const offset = parseInt(config.offset, 10)
    const isFilter = config.filterFuturePeriods
    const isReverse = periodType.match(/^FY|YEARLY/)
        ? true
        : config.reversePeriods

    const now = getNowInCalendar(calendar)
    const year = (now.eraYear || now.year) + offset

    const params = {
        periodType,
        year,
        calendar,
        locale: 'en',
        startingDay: config.startDay,
    }

    let periods = generateFixedPeriods(params)

    periods = isFilter ? fnFilter(periods) : periods
    periods = !isReverse ? periods : periods.reverse()

    return periods
}

const getDailyPeriodType = (fnFilter, calendar) => {
    return (config) => {
        return getPeriods({
            periodType: 'DAILY',
            config,
            fnFilter,
            calendar,
        })
    }
}

const getWeeklyPeriodType = (weekObj, fnFilter, calendar) => {
    return (config) => {
        return getPeriods({
            periodType: 'WEEKLY',
            config: {
                ...config,
                startDay: weekObj.startDay,
            },
            fnFilter,
            calendar,
        })
    }
}

const getBiWeeklyPeriodType = (fnFilter, calendar) => {
    return (config) => {
        return getPeriods({
            periodType: 'BIWEEKLY',
            config,
            fnFilter,
            calendar,
        })
    }
}

const getMonthlyPeriodType = (fnFilter, calendar) => {
    return (config) => {
        return getPeriods({ periodType: 'MONTHLY', config, fnFilter, calendar })
    }
}

const getBiMonthlyPeriodType = (fnFilter, calendar) => {
    return (config) => {
        return getPeriods({
            periodType: 'BIMONTHLY',
            config,
            fnFilter,
            calendar,
        })
    }
}

const getQuarterlyPeriodType = (fnFilter, calendar) => {
    return (config) => {
        return getPeriods({
            periodType: 'QUARTERLY',
            config,
            fnFilter,
            calendar,
        })
    }
}

const getSixMonthlyPeriodType = (fnFilter, calendar) => {
    return (config) => {
        return getPeriods({
            periodType: 'SIXMONTHLY',
            config,
            fnFilter,
            calendar,
        })
    }
}

const getSixMonthlyAprilPeriodType = (fnFilter, calendar) => {
    return (config) => {
        return getPeriods({
            periodType: 'SIXMONTHLYAPR',
            config,
            fnFilter,
            calendar,
        })
    }
}

const getYearlyPeriodType = (fnFilter, calendar) => {
    return (config) => {
        return getPeriods({
            periodType: 'YEARLY',
            config,
            fnFilter,
            calendar,
        })
    }
}

const getFinancialOctoberPeriodType = (fnFilter, calendar) => {
    return (config) => {
        return getPeriods({
            periodType: 'FYOCT',
            config,
            fnFilter,
            calendar,
        })
    }
}

const getFinancialNovemberPeriodType = (fnFilter, calendar) => {
    return (config) => {
        return getPeriods({
            periodType: 'FYNOV',
            config,
            fnFilter,
            calendar,
        })
    }
}

const getFinancialJulyPeriodType = (fnFilter, calendar) => {
    return (config) => {
        return getPeriods({
            periodType: 'FYJUL',
            config,
            fnFilter,
            calendar,
        })
    }
}

const getFinancialAprilPeriodType = (fnFilter, calendar) => {
    return (config) => {
        return getPeriods({
            periodType: 'FYAPR',
            config,
            fnFilter,
            calendar,
        })
    }
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

const getOptions = (calendar = 'gregory') => {
    return [
        {
            id: DAILY,
            getPeriods: getDailyPeriodType(filterFuturePeriods, calendar),
            name: i18n.t('Daily'),
        },
        {
            id: WEEKLY,
            getPeriods: getWeeklyPeriodType(
                { startDay: 1 },
                filterFuturePeriods,
                calendar
            ),
            name: i18n.t('Weekly'),
        },
        {
            id: WEEKLYWED,
            getPeriods: getWeeklyPeriodType(
                { startDay: 3 },
                filterFuturePeriods,
                calendar
            ),
            name: i18n.t('Weekly (Start Wednesday)'),
        },
        {
            id: WEEKLYTHU,
            getPeriods: getWeeklyPeriodType(
                { startDay: 4 },
                filterFuturePeriods,
                calendar
            ),
            name: i18n.t('Weekly (Start Thursday)'),
        },
        {
            id: WEEKLYSAT,
            getPeriods: getWeeklyPeriodType(
                { startDay: 6 },
                filterFuturePeriods,
                calendar
            ),
            name: i18n.t('Weekly (Start Saturday)'),
        },
        {
            id: WEEKLYSUN,
            getPeriods: getWeeklyPeriodType(
                { startDay: 7 },
                filterFuturePeriods,
                calendar
            ),
            name: i18n.t('Weekly (Start Sunday)'),
        },
        {
            id: BIWEEKLY,
            getPeriods: getBiWeeklyPeriodType(filterFuturePeriods, calendar),
            name: i18n.t('Bi-weekly'),
        },
        {
            id: MONTHLY,
            getPeriods: getMonthlyPeriodType(filterFuturePeriods, calendar),
            name: i18n.t('Monthly'),
        },
        {
            id: BIMONTHLY,
            getPeriods: getBiMonthlyPeriodType(filterFuturePeriods, calendar),
            name: i18n.t('Bi-monthly'),
        },
        {
            id: QUARTERLY,
            getPeriods: getQuarterlyPeriodType(filterFuturePeriods, calendar),
            name: i18n.t('Quarterly'),
        },
        {
            id: SIXMONTHLY,
            getPeriods: getSixMonthlyPeriodType(filterFuturePeriods, calendar),
            name: i18n.t('Six-monthly'),
        },
        {
            id: SIXMONTHLYAPR,
            getPeriods: getSixMonthlyAprilPeriodType(
                filterFuturePeriods,
                calendar
            ),
            name: i18n.t('Six-monthly April'),
        },
        {
            id: YEARLY,
            getPeriods: getYearlyPeriodType(filterFuturePeriods, calendar),
            name: i18n.t('Yearly'),
        },
        {
            id: FYNOV,
            getPeriods: getFinancialNovemberPeriodType(
                filterFuturePeriods,
                calendar
            ),
            name: i18n.t('Financial year (Start November)'),
        },
        {
            id: FYOCT,
            getPeriods: getFinancialOctoberPeriodType(
                filterFuturePeriods,
                calendar
            ),
            name: i18n.t('Financial year (Start October)'),
        },
        {
            id: FYJUL,
            getPeriods: getFinancialJulyPeriodType(
                filterFuturePeriods,
                calendar
            ),
            name: i18n.t('Financial year (Start July)'),
        },
        {
            id: FYAPR,
            getPeriods: getFinancialAprilPeriodType(
                filterFuturePeriods,
                calendar
            ),
            name: i18n.t('Financial year (Start April)'),
        },
    ]
}

export const getFixedPeriodsOptionsById = (id, calendar = 'gregory') => {
    return getOptions(calendar).find((option) => option.id === id)
}

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
