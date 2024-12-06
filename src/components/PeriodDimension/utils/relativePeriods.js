import i18n from '../../../locales/index.js'
import {
    DAILY,
    WEEKLY,
    BIWEEKLY,
    WEEKS_THIS_YEAR,
    MONTHLY,
    BIMONTHLY,
    QUARTERLY,
    SIXMONTHLY,
    FINANCIAL,
    YEARLY,
} from './index.js'

const getDaysPeriodType = () => [
    { id: 'TODAY', name: i18n.t('Today'), offset: 0, duration: 1 },
    { id: 'YESTERDAY', name: i18n.t('Yesterday'), offset: -1, duration: 1 },
    { id: 'LAST_3_DAYS', name: i18n.t('Last 3 days'), offset: -1, duration: 3 },
    { id: 'LAST_7_DAYS', name: i18n.t('Last 7 days'), offset: -1, duration: 7 },
    {
        id: 'LAST_14_DAYS',
        name: i18n.t('Last 14 days'),
        offset: -1,
        duration: 14,
    },
    {
        id: 'LAST_30_DAYS',
        name: i18n.t('Last 30 days'),
        offset: -1,
        duration: 30,
    },
    {
        id: 'LAST_60_DAYS',
        name: i18n.t('Last 60 days'),
        offset: -1,
        duration: 60,
    },
    {
        id: 'LAST_90_DAYS',
        name: i18n.t('Last 90 days'),
        offset: -1,
        duration: 90,
    },
    {
        id: 'LAST_180_DAYS',
        name: i18n.t('Last 180 days'),
        offset: -1,
        duration: 180,
    },
]

const getWeeksPeriodType = () => [
    { id: 'THIS_WEEK', name: i18n.t('This week'), offset: 0, duration: 1 },
    { id: 'LAST_WEEK', name: i18n.t('Last week'), offset: -1, duration: 1 },
    {
        id: 'LAST_4_WEEKS',
        name: i18n.t('Last 4 weeks'),
        offset: -1,
        duration: 4,
    },
    {
        id: 'LAST_12_WEEKS',
        name: i18n.t('Last 12 weeks'),
        offset: -1,
        duration: 12,
    },
    {
        id: 'LAST_52_WEEKS',
        name: i18n.t('Last 52 weeks'),
        offset: -1,
        duration: 52,
    },
    {
        id: WEEKS_THIS_YEAR,
        name: i18n.t('Weeks this year'),
        offset: 51,
        duration: 52,
    },
]

const getBiWeeksPeriodType = () => [
    { id: 'THIS_BIWEEK', name: i18n.t('This bi-week'), offset: 0, duration: 1 },
    {
        id: 'LAST_BIWEEK',
        name: i18n.t('Last bi-week'),
        offset: -1,
        duration: 1,
    },
    {
        id: 'LAST_4_BIWEEKS',
        name: i18n.t('Last 4 bi-weeks'),
        offset: -1,
        duration: 4,
    },
]

const getMonthsPeriodType = () => [
    { id: 'THIS_MONTH', name: i18n.t('This month'), offset: 0, duration: 1 },
    { id: 'LAST_MONTH', name: i18n.t('Last month'), offset: -1, duration: 1 },
    {
        id: 'LAST_3_MONTHS',
        name: i18n.t('Last 3 months'),
        offset: -1,
        duration: 3,
    },
    {
        id: 'LAST_6_MONTHS',
        name: i18n.t('Last 6 months'),
        offset: -1,
        duration: 6,
    },
    {
        id: 'LAST_12_MONTHS',
        name: i18n.t('Last 12 months'),
        offset: -1,
        duration: 12,
    },
    {
        id: 'MONTHS_THIS_YEAR',
        name: i18n.t('Months this year'),
        offset: 11,
        duration: 12,
    },
]

const getBiMonthsPeriodType = () => [
    {
        id: 'THIS_BIMONTH',
        name: i18n.t('This bi-month'),
        offset: 0,
        duration: 1,
    },
    {
        id: 'LAST_BIMONTH',
        name: i18n.t('Last bi-month'),
        offset: -1,
        duration: 1,
    },
    {
        id: 'LAST_6_BIMONTHS',
        name: i18n.t('Last 6 bi-months'),
        offset: -1,
        duration: 6,
    },
    {
        id: 'BIMONTHS_THIS_YEAR',
        name: i18n.t('Bi-months this year'),
        offset: 5,
        duration: 6,
    },
]

const getQuartersPeriodType = () => [
    {
        id: 'THIS_QUARTER',
        name: i18n.t('This quarter'),
        offset: 0,
        duration: 1,
    },
    {
        id: 'LAST_QUARTER',
        name: i18n.t('Last quarter'),
        offset: -1,
        duration: 1,
    },
    {
        id: 'LAST_4_QUARTERS',
        name: i18n.t('Last 4 quarters'),
        offset: -1,
        duration: 4,
    },
    {
        id: 'QUARTERS_THIS_YEAR',
        name: i18n.t('Quarters this year'),
        offset: 3,
        duration: 4,
    },
]

const getSixMonthsPeriodType = () => [
    {
        id: 'THIS_SIX_MONTH',
        name: i18n.t('This six-month'),
        offset: 0,
        duration: 1,
    },
    {
        id: 'LAST_SIX_MONTH',
        name: i18n.t('Last six-month'),
        offset: -1,
        duration: 1,
    },
    {
        id: 'LAST_2_SIXMONTHS',
        name: i18n.t('Last 2 six-month'),
        offset: -1,
        duration: 2,
    },
]

const getFinancialYearsPeriodType = () => [
    {
        id: 'THIS_FINANCIAL_YEAR',
        name: i18n.t('This financial year'),
        offset: 0,
        duration: 1,
    },
    {
        id: 'LAST_FINANCIAL_YEAR',
        name: i18n.t('Last financial year'),
        offset: -1,
        duration: 1,
    },
    {
        id: 'LAST_5_FINANCIAL_YEARS',
        name: i18n.t('Last 5 financial years'),
        offset: -1,
        duration: 5,
    },
]

const getYearsPeriodType = () => [
    { id: 'THIS_YEAR', name: i18n.t('This year'), offset: 0, duration: 1 },
    { id: 'LAST_YEAR', name: i18n.t('Last year'), offset: -1, duration: 1 },
    {
        id: 'LAST_5_YEARS',
        name: i18n.t('Last 5 years'),
        offset: -1,
        duration: 5,
    },
    {
        id: 'LAST_10_YEARS',
        name: i18n.t('Last 10 years'),
        offset: -1,
        duration: 10,
    },
]

const getOptions = () => [
    {
        id: DAILY,
        getPeriods: () => getDaysPeriodType(),
        name: i18n.t('Days'),
    },
    {
        id: WEEKLY,
        getPeriods: () => getWeeksPeriodType(),
        name: i18n.t('Weeks'),
    },
    {
        id: BIWEEKLY,
        getPeriods: () => getBiWeeksPeriodType(),
        name: i18n.t('Bi-weeks'),
    },
    {
        id: MONTHLY,
        getPeriods: () => getMonthsPeriodType(),
        name: i18n.t('Months'),
    },
    {
        id: BIMONTHLY,
        getPeriods: () => getBiMonthsPeriodType(),
        name: i18n.t('Bi-months'),
    },
    {
        id: QUARTERLY,
        getPeriods: () => getQuartersPeriodType(),
        name: i18n.t('Quarters'),
    },
    {
        id: SIXMONTHLY,
        getPeriods: () => getSixMonthsPeriodType(),
        name: i18n.t('Six-months'),
    },
    {
        id: FINANCIAL,
        getPeriods: () => getFinancialYearsPeriodType(),
        name: i18n.t('Financial Years'),
    },
    {
        id: YEARLY,
        getPeriods: () => getYearsPeriodType(),
        name: i18n.t('Years'),
    },
]

export const getRelativePeriodsOptionsById = (id) =>
    getOptions().find((option) => option.id === id)

export const getRelativePeriodsOptions = () => getOptions()

export const getRelativePeriodIds = () =>
    Object.values(getOptions())
        .map((option) => option.getPeriods().map((period) => period.id))
        .flat()

export const getRelativePeriodsDetails = () =>
    Object.values(getOptions())
        .map((option) =>
            option.getPeriods().map((period) => ({
                id: period.id,
                name: period.name,
                offset: period.offset,
                duration: period.duration,
                type: option.id,
            }))
        )
        .flat()
        .reduce((acc, period) => {
            acc[period.id] = period
            return acc
        }, {})

export const getRelativePeriodsName = () =>
    Object.values(getOptions())
        .map((option) => option.getPeriods())
        .flat()
        .reduce((acc, period) => {
            acc[period.id] = period.name
            return acc
        }, {})
