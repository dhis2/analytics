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
    { id: 'TODAY', name: i18n.t('Today') },
    { id: 'YESTERDAY', name: i18n.t('Yesterday') },
    { id: 'LAST_3_DAYS', name: i18n.t('Last 3 days') },
    { id: 'LAST_7_DAYS', name: i18n.t('Last 7 days') },
    { id: 'LAST_14_DAYS', name: i18n.t('Last 14 days') },
    { id: 'LAST_30_DAYS', name: i18n.t('Last 30 days') },
    { id: 'LAST_60_DAYS', name: i18n.t('Last 60 days') },
    { id: 'LAST_90_DAYS', name: i18n.t('Last 90 days') },
    { id: 'LAST_180_DAYS', name: i18n.t('Last 180 days') },
]

const getWeeksPeriodType = () => [
    { id: 'THIS_WEEK', name: i18n.t('This week') },
    { id: 'LAST_WEEK', name: i18n.t('Last week') },
    { id: 'LAST_4_WEEKS', name: i18n.t('Last 4 weeks') },
    { id: 'LAST_12_WEEKS', name: i18n.t('Last 12 weeks') },
    { id: 'LAST_52_WEEKS', name: i18n.t('Last 52 weeks') },
    { id: WEEKS_THIS_YEAR, name: i18n.t('Weeks this year') },
]

const getBiWeeksPeriodType = () => [
    { id: 'THIS_BIWEEK', name: i18n.t('This bi-week') },
    { id: 'LAST_BIWEEK', name: i18n.t('Last bi-week') },
    { id: 'LAST_4_BIWEEKS', name: i18n.t('Last 4 bi-weeks') },
]

const getMonthsPeriodType = () => [
    { id: 'THIS_MONTH', name: i18n.t('This month') },
    { id: 'LAST_MONTH', name: i18n.t('Last month') },
    { id: 'LAST_3_MONTHS', name: i18n.t('Last 3 months') },
    { id: 'LAST_6_MONTHS', name: i18n.t('Last 6 months') },
    { id: 'LAST_12_MONTHS', name: i18n.t('Last 12 months') },
    {
        id: 'MONTHS_THIS_YEAR',
        name: i18n.t('Months this year'),
    },
]

const getBiMonthsPeriodType = () => [
    { id: 'THIS_BIMONTH', name: i18n.t('This bi-month') },
    { id: 'LAST_BIMONTH', name: i18n.t('Last bi-month') },
    {
        id: 'LAST_6_BIMONTHS',
        name: i18n.t('Last 6 bi-months'),
    },
    {
        id: 'BIMONTHS_THIS_YEAR',
        name: i18n.t('Bi-months this year'),
    },
]

const getQuartersPeriodType = () => [
    { id: 'THIS_QUARTER', name: i18n.t('This quarter') },
    { id: 'LAST_QUARTER', name: i18n.t('Last quarter') },
    { id: 'LAST_4_QUARTERS', name: i18n.t('Last 4 quarters') },
    {
        id: 'QUARTERS_THIS_YEAR',
        name: i18n.t('Quarters this year'),
    },
]

const getSixMonthsPeriodType = () => [
    { id: 'THIS_SIX_MONTH', name: i18n.t('This six-month') },
    { id: 'LAST_SIX_MONTH', name: i18n.t('Last six-month') },
    {
        id: 'LAST_2_SIXMONTHS',
        name: i18n.t('Last 2 six-month'),
    },
]

const getFinancialYearsPeriodType = () => [
    {
        id: 'THIS_FINANCIAL_YEAR',
        name: i18n.t('This financial year'),
    },
    {
        id: 'LAST_FINANCIAL_YEAR',
        name: i18n.t('Last financial year'),
    },
    {
        id: 'LAST_5_FINANCIAL_YEARS',
        name: i18n.t('Last 5 financial years'),
    },
]

const getYearsPeriodType = () => [
    { id: 'THIS_YEAR', name: i18n.t('This year') },
    { id: 'LAST_YEAR', name: i18n.t('Last year') },
    { id: 'LAST_5_YEARS', name: i18n.t('Last 5 years') },
    { id: 'LAST_10_YEARS', name: i18n.t('Last 10 years') },
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
