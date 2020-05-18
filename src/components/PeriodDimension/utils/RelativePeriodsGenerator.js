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

const DaysPeriodType = [
    { id: 'TODAY', getName: () => i18n.t('Today') },
    { id: 'YESTERDAY', getName: () => i18n.t('Yesterday') },
    { id: 'LAST_3_DAYS', getName: () => i18n.t('Last 3 days') },
    { id: 'LAST_7_DAYS', getName: () => i18n.t('Last 7 days') },
    { id: 'LAST_14_DAYS', getName: () => i18n.t('Last 14 days') },
]

const WeeksPeriodType = [
    { id: 'THIS_WEEK', getName: () => i18n.t('This week') },
    { id: 'LAST_WEEK', getName: () => i18n.t('Last week') },
    { id: 'LAST_4_WEEKS', getName: () => i18n.t('Last 4 weeks') },
    { id: 'LAST_12_WEEKS', getName: () => i18n.t('Last 12 weeks') },
    { id: 'LAST_52_WEEKS', getName: () => i18n.t('Last 52 weeks') },
    { id: 'WEEKS_THIS_YEAR', getName: () => i18n.t('Weeks this year') },
]

const BiWeeksPeriodType = [
    { id: 'THIS_BIWEEK', getName: () => i18n.t('This bi-week') },
    { id: 'LAST_BIWEEK', getName: () => i18n.t('Last bi-week') },
    { id: 'LAST_4_BIWEEKS', getName: () => i18n.t('Last 4 bi-weeks') },
]

const MonthsPeriodType = [
    { id: 'THIS_MONTH', getName: () => i18n.t('This month') },
    { id: 'LAST_MONTH', getName: () => i18n.t('Last month') },
    { id: 'LAST_3_MONTHS', getName: () => i18n.t('Last 3 months') },
    { id: 'LAST_6_MONTHS', getName: () => i18n.t('Last 6 months') },
    { id: 'LAST_12_MONTHS', getName: () => i18n.t('Last 12 months') },
    {
        id: 'MONTHS_THIS_YEAR',
        getName: () => i18n.t('Months this year'),
    },
]

const BiMonthsPeriodType = [
    { id: 'THIS_BIMONTH', getName: () => i18n.t('This bi-month') },
    { id: 'LAST_BIMONTH', getName: () => i18n.t('Last bi-month') },
    {
        id: 'LAST_6_BIMONTHS',
        getName: () => i18n.t('Last 6 bi-months'),
    },
    {
        id: 'BIMONTHS_THIS_YEAR',
        getName: () => i18n.t('Bi-months this year'),
    },
]

const QuartersPeriodType = [
    { id: 'THIS_QUARTER', getName: () => i18n.t('This quarter') },
    { id: 'LAST_QUARTER', getName: () => i18n.t('Last quarter') },
    { id: 'LAST_4_QUARTERS', getName: () => i18n.t('Last 4 quarters') },
    {
        id: 'QUARTERS_THIS_YEAR',
        getName: () => i18n.t('Quarters this year'),
    },
]

const SixMonthsPeriodType = [
    { id: 'THIS_SIX_MONTH', getName: () => i18n.t('This six-month') },
    { id: 'LAST_SIX_MONTH', getName: () => i18n.t('Last six-month') },
    {
        id: 'LAST_2_SIXMONTHS',
        getName: () => i18n.t('Last 2 six-month'),
    },
]

const FinancialYearsPeriodType = [
    {
        id: 'THIS_FINANCIAL_YEAR',
        getName: () => i18n.t('This financial year'),
    },
    {
        id: 'LAST_FINANCIAL_YEAR',
        getName: () => i18n.t('Last financial year'),
    },
    {
        id: 'LAST_5_FINANCIAL_YEARS',
        getName: () => i18n.t('Last 5 financial years'),
    },
]

const YearsPeriodType = [
    { id: 'THIS_YEAR', getName: () => i18n.t('This year') },
    { id: 'LAST_YEAR', getName: () => i18n.t('Last year') },
    { id: 'LAST_5_YEARS', getName: () => i18n.t('Last 5 years') },
]

const options = [
    { id: DAYS, periods: DaysPeriodType, getName: () => i18n.t('Days') },
    { id: WEEKS, periods: WeeksPeriodType, getName: () => i18n.t('Weeks') },
    {
        id: BIWEEKS,
        periods: BiWeeksPeriodType,
        getName: () => i18n.t('Bi-weeks'),
    },
    {
        id: MONTHS,
        periods: MonthsPeriodType,
        getName: () => i18n.t('Months'),
    },
    {
        id: BIMONTHS,
        geneperiodsrperiodsator: BiMonthsPeriodType,
        getName: () => i18n.t('Bi-months'),
    },
    {
        id: QUARTERS,
        periods: QuartersPeriodType,
        getName: () => i18n.t('Quarters'),
    },
    {
        id: SIXMONTHS,
        periods: SixMonthsPeriodType,
        getName: () => i18n.t('Six-months'),
    },
    {
        id: FINACIALYEARS,
        periods: FinancialYearsPeriodType,
        getName: () => i18n.t('Financial Years'),
    },
    { id: YEARS, periods: YearsPeriodType, getName: () => i18n.t('Years') },
]

export const getRelativePeriodsOptionsById = id =>
    options.find(option => option.id === id)

export const getRelativePeriodsOptions = () => options
