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
    WEEKLYFRI,
    WEEKLYSAT,
    WEEKLYSUN,
    BIWEEKLY,
    MONTHLY,
    BIMONTHLY,
    QUARTERLY,
    SIXMONTHLY,
    SIXMONTHLYAPR,
    YEARLY,
    FYFEB,
    FYAPR,
    FYJUL,
    FYAUG,
    FYSEP,
    FYOCT,
    FYNOV,
} from './index.js'

export const PERIOD_TYPE_REGEX = {
    [DAILY]: /^(\d{4})(\d{2})(\d{2})$/, // YYYYMMDD
    [WEEKLY]: /^(\d{4})W(\d{1,2})$/, // YYYY"W"[1-53]
    [BIWEEKLY]: /^(\d{4})BiW(\d{1,2})$/, // YYYY"BiW"[1-27]
    [WEEKLYWED]: /^(\d{4})(Wed)W(\d{1,2})$/, // YYYY"WedW"[1-53]
    [WEEKLYTHU]: /^(\d{4})(Thu)W(\d{1,2})$/, // YYYY"ThuW"[1-53]
    [WEEKLYFRI]: /^(\d{4})(Fri)W(\d{1,2})$/, // YYYY"FriW"[1-53]
    [WEEKLYSAT]: /^(\d{4})(Sat)W(\d{1,2})$/, // YYYY"SatW"[1-53]
    [WEEKLYSUN]: /^(\d{4})(Sun)W(\d{1,2})$/, // YYYY"SunW"[1-53]
    [MONTHLY]: /^(\d{4})(\d{2})$/, // YYYYMM
    [BIMONTHLY]: /^(\d{4})(\d{2})B$/, // YYYY0[1-6]"B"
    [QUARTERLY]: /^(\d{4})Q([1234])$/, // YYYY"Q"[1-4]
    [SIXMONTHLY]: /^(\d{4})S([12])$/, // YYYY"S"[1/2]
    [SIXMONTHLYAPR]: /^(\d{4})AprilS([12])$/, // YYYY"AprilS"[1/2]
    // [SIXMONTHLYNOV]: /^(\d{4})NovS([12])$/, // YYYY"NovS"[1/2] Not supported?
    [YEARLY]: /^(\d{4})$/, // YYYY
    [FYNOV]: /^(\d{4})Nov$/, // YYYY"Nov"
    [FYOCT]: /^(\d{4})Oct$/, // YYYY"Oct"
    [FYJUL]: /^(\d{4})July$/, // YYYY"July"
    [FYAPR]: /^(\d{4})April$/, // YYYY"April"
}

const getPeriods = ({ periodType, config, fnFilter, periodSettings = {} }) => {
    const offset = parseInt(config.offset, 10)
    const isFilter = config.filterFuturePeriods
    const isReverse = periodType.match(/^FY|YEARLY/)
        ? true
        : config.reversePeriods

    const { calendar = 'gregory', locale = 'en' } = periodSettings
    const now = getNowInCalendar(calendar)
    const year = (now.eraYear || now.year) + offset

    const params = {
        periodType,
        year,
        calendar,
        locale,
        startingDay: config.startDay,
    }

    let periods = generateFixedPeriods(params)

    periods = isFilter ? fnFilter(periods) : periods
    periods = !isReverse ? periods : periods.reverse()

    return periods
}

const getDailyPeriodType = (fnFilter, periodSettings) => {
    return (config) => {
        return getPeriods({
            periodType: 'DAILY',
            config,
            fnFilter,
            periodSettings,
        })
    }
}

const getWeeklyPeriodType = (weekObj, fnFilter, periodSettings) => {
    return (config) => {
        return getPeriods({
            periodType: 'WEEKLY',
            config: {
                ...config,
                startDay: weekObj.startDay,
            },
            fnFilter,
            periodSettings,
        })
    }
}

const getBiWeeklyPeriodType = (fnFilter, periodSettings) => {
    return (config) => {
        return getPeriods({
            periodType: 'BIWEEKLY',
            config,
            fnFilter,
            periodSettings,
        })
    }
}

const getMonthlyPeriodType = (fnFilter, periodSettings) => {
    return (config) => {
        return getPeriods({
            periodType: 'MONTHLY',
            config,
            fnFilter,
            periodSettings,
        })
    }
}

const getBiMonthlyPeriodType = (fnFilter, periodSettings) => {
    return (config) => {
        return getPeriods({
            periodType: 'BIMONTHLY',
            config,
            fnFilter,
            periodSettings,
        })
    }
}

const getQuarterlyPeriodType = (fnFilter, periodSettings) => {
    return (config) => {
        return getPeriods({
            periodType: 'QUARTERLY',
            config,
            fnFilter,
            periodSettings,
        })
    }
}

const getSixMonthlyPeriodType = (fnFilter, periodSettings) => {
    return (config) => {
        return getPeriods({
            periodType: 'SIXMONTHLY',
            config,
            fnFilter,
            periodSettings,
        })
    }
}

const getSixMonthlyAprilPeriodType = (fnFilter, periodSettings) => {
    return (config) => {
        return getPeriods({
            periodType: 'SIXMONTHLYAPR',
            config,
            fnFilter,
            periodSettings,
        })
    }
}

const getYearlyPeriodType = (fnFilter, periodSettings) => {
    return (config) => {
        return getPeriods({
            periodType: 'YEARLY',
            config,
            fnFilter,
            periodSettings,
        })
    }
}

const getFinancialPeriodType = (periodType, fnFilter, periodSettings) => {
    return (config) => {
        return getPeriods({
            periodType,
            config,
            fnFilter,
            periodSettings,
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

const getOptions = (periodSettings) => {
    return [
        {
            id: DAILY,
            getPeriods: getDailyPeriodType(filterFuturePeriods, periodSettings),
            name: i18n.t('Daily'),
        },
        {
            id: WEEKLY,
            getPeriods: getWeeklyPeriodType(
                { startDay: 1 },
                filterFuturePeriods,
                periodSettings
            ),
            name: i18n.t('Weekly'),
        },
        {
            id: WEEKLYWED,
            getPeriods: getWeeklyPeriodType(
                { startDay: 3 },
                filterFuturePeriods,
                periodSettings
            ),
            name: i18n.t('Weekly (Start Wednesday)'),
        },
        {
            id: WEEKLYTHU,
            getPeriods: getWeeklyPeriodType(
                { startDay: 4 },
                filterFuturePeriods,
                periodSettings
            ),
            name: i18n.t('Weekly (Start Thursday)'),
        },
        {
            id: WEEKLYFRI,
            getPeriods: getWeeklyPeriodType(
                { startDay: 5 },
                filterFuturePeriods,
                periodSettings
            ),
            name: i18n.t('Weekly (Start Friday)'),
        },
        {
            id: WEEKLYSAT,
            getPeriods: getWeeklyPeriodType(
                { startDay: 6 },
                filterFuturePeriods,
                periodSettings
            ),
            name: i18n.t('Weekly (Start Saturday)'),
        },
        {
            id: WEEKLYSUN,
            getPeriods: getWeeklyPeriodType(
                { startDay: 7 },
                filterFuturePeriods,
                periodSettings
            ),
            name: i18n.t('Weekly (Start Sunday)'),
        },
        {
            id: BIWEEKLY,
            getPeriods: getBiWeeklyPeriodType(
                filterFuturePeriods,
                periodSettings
            ),
            name: i18n.t('Bi-weekly'),
        },
        {
            id: MONTHLY,
            getPeriods: getMonthlyPeriodType(
                filterFuturePeriods,
                periodSettings
            ),
            name: i18n.t('Monthly'),
        },
        {
            id: BIMONTHLY,
            getPeriods: getBiMonthlyPeriodType(
                filterFuturePeriods,
                periodSettings
            ),
            name: i18n.t('Bi-monthly'),
        },
        {
            id: QUARTERLY,
            getPeriods: getQuarterlyPeriodType(
                filterFuturePeriods,
                periodSettings
            ),
            name: i18n.t('Quarterly'),
        },
        {
            id: SIXMONTHLY,
            getPeriods: getSixMonthlyPeriodType(
                filterFuturePeriods,
                periodSettings
            ),
            name: i18n.t('Six-monthly'),
        },
        {
            id: SIXMONTHLYAPR,
            getPeriods: getSixMonthlyAprilPeriodType(
                filterFuturePeriods,
                periodSettings
            ),
            name: i18n.t('Six-monthly April'),
        },
        {
            id: YEARLY,
            getPeriods: getYearlyPeriodType(
                filterFuturePeriods,
                periodSettings
            ),
            name: i18n.t('Yearly'),
        },
        {
            id: FYFEB,
            getPeriods: getFinancialPeriodType(
                'FYFEB',
                filterFuturePeriods,
                periodSettings
            ),
            name: i18n.t('Financial year (Start February)'),
        },
        {
            id: FYAPR,
            getPeriods: getFinancialPeriodType(
                'FYAPR',
                filterFuturePeriods,
                periodSettings
            ),
            name: i18n.t('Financial year (Start April)'),
        },
        {
            id: FYJUL,
            getPeriods: getFinancialPeriodType(
                'FYJUL',
                filterFuturePeriods,
                periodSettings
            ),
            name: i18n.t('Financial year (Start July)'),
        },
        {
            id: FYAUG,
            getPeriods: getFinancialPeriodType(
                'FYAUG',
                filterFuturePeriods,
                periodSettings
            ),
            name: i18n.t('Financial year (Start August)'),
        },
        {
            id: FYSEP,
            getPeriods: getFinancialPeriodType(
                'FYSEP',
                filterFuturePeriods,
                periodSettings
            ),
            name: i18n.t('Financial year (Start September)'),
        },
        {
            id: FYOCT,
            getPeriods: getFinancialPeriodType(
                'FYOCT',
                filterFuturePeriods,
                periodSettings
            ),
            name: i18n.t('Financial year (Start October)'),
        },
        {
            id: FYNOV,
            getPeriods: getFinancialPeriodType(
                'FYNOV',
                filterFuturePeriods,
                periodSettings
            ),
            name: i18n.t('Financial year (Start November)'),
        },
    ]
}

export const getFixedPeriodsOptionsById = (id, periodSettings) => {
    return getOptions(periodSettings).find((option) => option.id === id)
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
