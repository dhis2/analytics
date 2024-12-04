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
    { id: 'TODAY', name: i18n.t('Today'), itemsCount: 1 },
    { id: 'YESTERDAY', name: i18n.t('Yesterday'), itemsCount: 1 },
    { id: 'LAST_3_DAYS', name: i18n.t('Last 3 days'), itemsCount: 3 },
    { id: 'LAST_7_DAYS', name: i18n.t('Last 7 days'), itemsCount: 7 },
    { id: 'LAST_14_DAYS', name: i18n.t('Last 14 days'), itemsCount: 14 },
    { id: 'LAST_30_DAYS', name: i18n.t('Last 30 days'), itemsCount: 30 },
    { id: 'LAST_60_DAYS', name: i18n.t('Last 60 days'), itemsCount: 60 },
    { id: 'LAST_90_DAYS', name: i18n.t('Last 90 days'), itemsCount: 90 },
    { id: 'LAST_180_DAYS', name: i18n.t('Last 180 days'), itemsCount: 180 },
]

const getWeeksPeriodType = () => [
    { id: 'THIS_WEEK', name: i18n.t('This week'), itemsCount: 1 },
    { id: 'LAST_WEEK', name: i18n.t('Last week'), itemsCount: 1 },
    { id: 'LAST_4_WEEKS', name: i18n.t('Last 4 weeks'), itemsCount: 4 },
    { id: 'LAST_12_WEEKS', name: i18n.t('Last 12 weeks'), itemsCount: 12 },
    { id: 'LAST_52_WEEKS', name: i18n.t('Last 52 weeks'), itemsCount: 52 },
    { id: WEEKS_THIS_YEAR, name: i18n.t('Weeks this year'), itemsCount: 52 },
]

const getBiWeeksPeriodType = () => [
    { id: 'THIS_BIWEEK', name: i18n.t('This bi-week'), itemsCount: 1 },
    { id: 'LAST_BIWEEK', name: i18n.t('Last bi-week'), itemsCount: 1 },
    { id: 'LAST_4_BIWEEKS', name: i18n.t('Last 4 bi-weeks'), itemsCount: 4 },
]

const getMonthsPeriodType = () => [
    { id: 'THIS_MONTH', name: i18n.t('This month'), itemsCount: 1 },
    { id: 'LAST_MONTH', name: i18n.t('Last month'), itemsCount: 1 },
    { id: 'LAST_3_MONTHS', name: i18n.t('Last 3 months'), itemsCount: 3 },
    { id: 'LAST_6_MONTHS', name: i18n.t('Last 6 months'), itemsCount: 6 },
    { id: 'LAST_12_MONTHS', name: i18n.t('Last 12 months'), itemsCount: 12 },
    {
        id: 'MONTHS_THIS_YEAR',
        name: i18n.t('Months this year'),
        itemsCount: 12,
    },
]

const getBiMonthsPeriodType = () => [
    { id: 'THIS_BIMONTH', name: i18n.t('This bi-month'), itemsCount: 1 },
    { id: 'LAST_BIMONTH', name: i18n.t('Last bi-month'), itemsCount: 1 },
    {
        id: 'LAST_6_BIMONTHS',
        name: i18n.t('Last 6 bi-months'),
        itemsCount: 6,
    },
    {
        id: 'BIMONTHS_THIS_YEAR',
        name: i18n.t('Bi-months this year'),
        itemsCount: 6,
    },
]

const getQuartersPeriodType = () => [
    { id: 'THIS_QUARTER', name: i18n.t('This quarter'), itemsCount: 1 },
    { id: 'LAST_QUARTER', name: i18n.t('Last quarter'), itemsCount: 1 },
    { id: 'LAST_4_QUARTERS', name: i18n.t('Last 4 quarters'), itemsCount: 4 },
    {
        id: 'QUARTERS_THIS_YEAR',
        name: i18n.t('Quarters this year'),
        itemsCount: 4,
    },
]

const getSixMonthsPeriodType = () => [
    { id: 'THIS_SIX_MONTH', name: i18n.t('This six-month'), itemsCount: 1 },
    { id: 'LAST_SIX_MONTH', name: i18n.t('Last six-month'), itemsCount: 1 },
    {
        id: 'LAST_2_SIXMONTHS',
        name: i18n.t('Last 2 six-month'),
        itemsCount: 2,
    },
]

const getFinancialYearsPeriodType = () => [
    {
        id: 'THIS_FINANCIAL_YEAR',
        name: i18n.t('This financial year'),
        itemsCount: 1,
    },
    {
        id: 'LAST_FINANCIAL_YEAR',
        name: i18n.t('Last financial year'),
        itemsCount: 1,
    },
    {
        id: 'LAST_5_FINANCIAL_YEARS',
        name: i18n.t('Last 5 financial years'),
        itemsCount: 5,
    },
]

const getYearsPeriodType = () => [
    { id: 'THIS_YEAR', name: i18n.t('This year'), itemsCount: 1 },
    { id: 'LAST_YEAR', name: i18n.t('Last year'), itemsCount: 1 },
    { id: 'LAST_5_YEARS', name: i18n.t('Last 5 years'), itemsCount: 5 },
    { id: 'LAST_10_YEARS', name: i18n.t('Last 10 years'), itemsCount: 10 },
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

export const getRelativePeriodsName = () =>
    Object.values(getOptions())
        .map((option) => option.getPeriods())
        .flat()
        .reduce((acc, period) => {
            acc[period.id] = period.name
            return acc
        }, {})

export const getRelativePeriodsItemsCount = () =>
    Object.values(getOptions())
        .map((option) => option.getPeriods())
        .flat()
        .reduce((acc, period) => {
            acc[period.id] = period.itemsCount
            return acc
        }, {})
