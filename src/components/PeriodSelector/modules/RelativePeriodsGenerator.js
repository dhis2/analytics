import i18n from '@dhis2/d2-i18n'

export const MONTHS = 'Months'

const DaysPeriodType = {
    generatePeriods() {
        return [
            { id: 'TODAY', name: () => i18n.t('Today') },
            { id: 'YESTERDAY', name: () => i18n.t('Yesterday') },
            { id: 'LAST_3_DAYS', name: () => i18n.t('Last 3 days') },
            { id: 'LAST_7_DAYS', name: () => i18n.t('Last 7 days') },
            { id: 'LAST_14_DAYS', name: () => i18n.t('Last 14 days') },
        ]
    },
}

const WeeksPeriodType = {
    generatePeriods() {
        return [
            { id: 'THIS_WEEK', name: () => i18n.t('This week') },
            { id: 'LAST_WEEK', name: () => i18n.t('Last week') },
            { id: 'LAST_4_WEEKS', name: () => i18n.t('Last 4 weeks') },
            { id: 'LAST_12_WEEKS', name: () => i18n.t('Last 12 weeks') },
            { id: 'LAST_52_WEEKS', name: () => i18n.t('Last 52 weeks') },
            { id: 'WEEKS_THIS_YEAR', name: () => i18n.t('Weeks this year') },
        ]
    },
}

const BiWeeksPeriodType = {
    generatePeriods() {
        return [
            { id: 'THIS_BIWEEK', name: () => i18n.t('This bi-week') },
            { id: 'LAST_BIWEEK', name: () => i18n.t('Last bi-week') },
            { id: 'LAST_4_BIWEEKS', name: () => i18n.t('Last 4 bi-weeks') },
        ]
    },
}

const MonthsPeriodType = {
    generatePeriods() {
        return [
            { id: 'THIS_MONTH', name: () => i18n.t('This month') },
            { id: 'LAST_MONTH', name: () => i18n.t('Last month') },
            { id: 'LAST_3_MONTHS', name: () => i18n.t('Last 3 months') },
            { id: 'LAST_6_MONTHS', name: () => i18n.t('Last 6 months') },
            { id: 'LAST_12_MONTHS', name: () => i18n.t('Last 12 months') },
            { id: 'MONTHS_THIS_YEAR', name: () => i18n.t('Months this year') },
        ]
    },
}

const BiMonthsPeriodType = {
    generatePeriods() {
        return [
            { id: 'THIS_BIMONTH', name: () => i18n.t('This bi-month') },
            { id: 'LAST_BIMONTH', name: () => i18n.t('Last bi-month') },
            { id: 'LAST_6_BIMONTHS', name: () => i18n.t('Last 6 bi-months') },
            {
                id: 'BIMONTHS_THIS_YEAR',
                name: () => i18n.t('Bi-months this year'),
            },
        ]
    },
}

const QuartersPeriodType = {
    generatePeriods() {
        return [
            { id: 'THIS_QUARTER', name: () => i18n.t('This quarter') },
            { id: 'LAST_QUARTER', name: () => i18n.t('Last quarter') },
            { id: 'LAST_4_QUARTERS', name: () => i18n.t('Last 4 quarters') },
            {
                id: 'QUARTERS_THIS_YEAR',
                name: () => i18n.t('Quarters this year'),
            },
        ]
    },
}

const SixMonthsPeriodType = {
    generatePeriods() {
        return [
            { id: 'THIS_SIX_MONTH', name: () => i18n.t('This six-month') },
            { id: 'LAST_SIX_MONTH', name: () => i18n.t('Last six-month') },
            { id: 'LAST_2_SIXMONTHS', name: () => i18n.t('Last 2 six-month') },
        ]
    },
}

const FinancialYearsPeriodType = {
    generatePeriods() {
        return [
            {
                id: 'THIS_FINANCIAL_YEAR',
                name: () => i18n.t('This financial year'),
            },
            {
                id: 'LAST_FINANCIAL_YEAR',
                name: () => i18n.t('Last financial year'),
            },
            {
                id: 'LAST_5_FINANCIAL_YEARS',
                name: () => i18n.t('Last 5 financial years'),
            },
        ]
    },
}

const YearsPeriodType = {
    generatePeriods() {
        return [
            { id: 'THIS_YEAR', name: () => i18n.t('This year') },
            { id: 'LAST_YEAR', name: () => i18n.t('Last year') },
            { id: 'LAST_5_YEARS', name: () => i18n.t('Last 5 years') },
        ]
    },
}

export default class Generator {
    options = {
        Days: { generator: DaysPeriodType, name: () => i18n.t('Days') },
        Weeks: { generator: WeeksPeriodType, name: () => i18n.t('Weeks') },
        BiWeeks: {
            generator: BiWeeksPeriodType,
            name: () => i18n.t('Bi-weeks'),
        },
        [MONTHS]: { generator: MonthsPeriodType, name: () => i18n.t('Months') },
        BiMonths: {
            generator: BiMonthsPeriodType,
            name: () => i18n.t('Bi-months'),
        },
        Quarters: {
            generator: QuartersPeriodType,
            name: () => i18n.t('Quarters'),
        },
        SixMonths: {
            generator: SixMonthsPeriodType,
            name: () => i18n.t('Six-months'),
        },
        FinancialYears: {
            generator: FinancialYearsPeriodType,
            name: () => i18n.t('Financial Years'),
        },
        Years: { generator: YearsPeriodType, name: () => i18n.t('Years') },
    }

    get = key => this.options[key].generator

    getOptions = () => this.options
}
