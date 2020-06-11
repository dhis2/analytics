import i18n from '@dhis2/d2-i18n'

export const DAYS = 'Days'
export const WEEKS = 'Weeks'
export const BIWEEKS = 'BiWeeks'
export const MONTHS = 'Months'
export const BIMONTHS = 'BiMonths'
export const QUARTERS = 'Quarters'
export const SIXMONTHS = 'SixMonths'
export const FINACIALYEARS = 'FinancialYears'
export const YEARS = 'Years'

const getDaysPeriodType = () => [
    { id: 'TODAY', name: i18n.t('Today') },
    { id: 'YESTERDAY', name: i18n.t('Yesterday') },
    { id: 'LAST_3_DAYS', name: i18n.t('Last 3 days') },
    { id: 'LAST_7_DAYS', name: i18n.t('Last 7 days') },
    { id: 'LAST_14_DAYS', name: i18n.t('Last 14 days') },
]

const getWeeksPeriodType = () => [
    { id: 'THIS_WEEK', name: i18n.t('This week') },
    { id: 'LAST_WEEK', name: i18n.t('Last week') },
    { id: 'LAST_4_WEEKS', name: i18n.t('Last 4 weeks') },
    { id: 'LAST_12_WEEKS', name: i18n.t('Last 12 weeks') },
    { id: 'LAST_52_WEEKS', name: i18n.t('Last 52 weeks') },
    { id: 'WEEKS_THIS_YEAR', name: i18n.t('Weeks this year') },
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
]

const getOptions = () => [
    { id: DAYS, getPeriods: () => getDaysPeriodType(), name: i18n.t('Days') },
    {
        id: WEEKS,
        getPeriods: () => getWeeksPeriodType(),
        name: i18n.t('Weeks'),
    },
    {
        id: BIWEEKS,
        getPeriods: () => getBiWeeksPeriodType(),
        name: i18n.t('Bi-weeks'),
    },
    {
        id: MONTHS,
        getPeriods: () => getMonthsPeriodType(),
        name: i18n.t('Months'),
    },
    {
        id: BIMONTHS,
        getPeriods: () => getBiMonthsPeriodType(),
        name: i18n.t('Bi-months'),
    },
    {
        id: QUARTERS,
        getPeriods: () => getQuartersPeriodType(),
        name: i18n.t('Quarters'),
    },
    {
        id: SIXMONTHS,
        getPeriods: () => getSixMonthsPeriodType(),
        name: i18n.t('Six-months'),
    },
    {
        id: FINACIALYEARS,
        getPeriods: () => getFinancialYearsPeriodType(),
        name: i18n.t('Financial Years'),
    },
    {
        id: YEARS,
        getPeriods: () => getYearsPeriodType(),
        name: i18n.t('Years'),
    },
]

export const getRelativePeriodsOptionsById = id =>
    getOptions().find(option => option.id === id)

export const getRelativePeriodsOptions = () => getOptions()
