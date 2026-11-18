// All period types from /api/periodTypes (v44) with default names, in server order.
// Fields as requested by the v44 period selector: name,displayName,relativePeriods
export const periodTypesV44 = [
    {
        name: 'Daily',
        displayName: 'Daily',
        relativePeriods: {
            TODAY: {
                displayName: 'Today',
            },
            YESTERDAY: {
                displayName: 'Yesterday',
            },
            LAST_3_DAYS: {
                displayName: 'Last 3 days',
            },
            LAST_7_DAYS: {
                displayName: 'Last 7 days',
            },
            LAST_14_DAYS: {
                displayName: 'Last 14 days',
            },
            LAST_30_DAYS: {
                displayName: 'Last 30 days',
            },
            LAST_60_DAYS: {
                displayName: 'Last 60 days',
            },
            LAST_90_DAYS: {
                displayName: 'Last 90 days',
            },
            LAST_180_DAYS: {
                displayName: 'Last 180 days',
            },
        },
    },
    {
        name: 'Weekly',
        displayName: 'Weekly',
        relativePeriods: {
            WEEKS_THIS_YEAR: {
                displayName: 'Weeks this year',
            },
            THIS_WEEK: {
                displayName: 'This week',
            },
            LAST_WEEK: {
                displayName: 'Last week',
            },
            LAST_4_WEEKS: {
                displayName: 'Last 4 weeks',
            },
            LAST_12_WEEKS: {
                displayName: 'Last 12 weeks',
            },
            LAST_52_WEEKS: {
                displayName: 'Last 52 weeks',
            },
        },
    },
    {
        name: 'WeeklyWednesday',
        displayName: 'Weekly Wednesday',
        relativePeriods: {
            WEEKS_THIS_YEAR: {
                displayName: 'Weeks this year',
            },
            THIS_WEEK: {
                displayName: 'This week',
            },
            LAST_WEEK: {
                displayName: 'Last week',
            },
            LAST_4_WEEKS: {
                displayName: 'Last 4 weeks',
            },
            LAST_12_WEEKS: {
                displayName: 'Last 12 weeks',
            },
            LAST_52_WEEKS: {
                displayName: 'Last 52 weeks',
            },
        },
    },
    {
        name: 'WeeklyThursday',
        displayName: 'Weekly Thursday',
        relativePeriods: {
            WEEKS_THIS_YEAR: {
                displayName: 'Weeks this year',
            },
            THIS_WEEK: {
                displayName: 'This week',
            },
            LAST_WEEK: {
                displayName: 'Last week',
            },
            LAST_4_WEEKS: {
                displayName: 'Last 4 weeks',
            },
            LAST_12_WEEKS: {
                displayName: 'Last 12 weeks',
            },
            LAST_52_WEEKS: {
                displayName: 'Last 52 weeks',
            },
        },
    },
    {
        name: 'WeeklyFriday',
        displayName: 'WeeklyFriday',
        relativePeriods: {
            WEEKS_THIS_YEAR: {
                displayName: 'Weeks this year',
            },
            THIS_WEEK: {
                displayName: 'This week',
            },
            LAST_WEEK: {
                displayName: 'Last week',
            },
            LAST_4_WEEKS: {
                displayName: 'Last 4 weeks',
            },
            LAST_12_WEEKS: {
                displayName: 'Last 12 weeks',
            },
            LAST_52_WEEKS: {
                displayName: 'Last 52 weeks',
            },
        },
    },
    {
        name: 'WeeklySaturday',
        displayName: 'Weekly Saturday',
        relativePeriods: {
            WEEKS_THIS_YEAR: {
                displayName: 'Weeks this year',
            },
            THIS_WEEK: {
                displayName: 'This week',
            },
            LAST_WEEK: {
                displayName: 'Last week',
            },
            LAST_4_WEEKS: {
                displayName: 'Last 4 weeks',
            },
            LAST_12_WEEKS: {
                displayName: 'Last 12 weeks',
            },
            LAST_52_WEEKS: {
                displayName: 'Last 52 weeks',
            },
        },
    },
    {
        name: 'WeeklySunday',
        displayName: 'Weekly Sunday',
        relativePeriods: {
            WEEKS_THIS_YEAR: {
                displayName: 'Weeks this year',
            },
            THIS_WEEK: {
                displayName: 'This week',
            },
            LAST_WEEK: {
                displayName: 'Last week',
            },
            LAST_4_WEEKS: {
                displayName: 'Last 4 weeks',
            },
            LAST_12_WEEKS: {
                displayName: 'Last 12 weeks',
            },
            LAST_52_WEEKS: {
                displayName: 'Last 52 weeks',
            },
        },
    },
    {
        name: 'BiWeekly',
        displayName: 'Bi-weekly',
        relativePeriods: {
            THIS_BIWEEK: {
                displayName: 'This bi-week',
            },
            LAST_BIWEEK: {
                displayName: 'Last bi-week',
            },
            LAST_4_BIWEEKS: {
                displayName: 'Last 4 bi-weeks',
            },
        },
    },
    {
        name: 'Monthly',
        displayName: 'Monthly',
        relativePeriods: {
            THIS_MONTH: {
                displayName: 'This month',
            },
            LAST_MONTH: {
                displayName: 'Last month',
            },
            MONTHS_THIS_YEAR: {
                displayName: 'Months this year',
            },
            MONTHS_LAST_YEAR: {
                displayName: 'Months last year',
            },
            LAST_12_MONTHS: {
                displayName: 'Last 12 months',
            },
            LAST_6_MONTHS: {
                displayName: 'Last 6 months',
            },
            LAST_3_MONTHS: {
                displayName: 'Last 3 months',
            },
        },
    },
    {
        name: 'BiMonthly',
        displayName: 'Bi-monthly',
        relativePeriods: {
            THIS_BIMONTH: {
                displayName: 'This bi-month',
            },
            LAST_BIMONTH: {
                displayName: 'Last bi-month',
            },
            BIMONTHS_THIS_YEAR: {
                displayName: 'Bi-months this year',
            },
            LAST_6_BIMONTHS: {
                displayName: 'Last 6 bi-months',
            },
        },
    },
    {
        name: 'Quarterly',
        displayName: 'Quarterly',
        relativePeriods: {
            THIS_QUARTER: {
                displayName: 'This quarter',
            },
            LAST_QUARTER: {
                displayName: 'Last quarter',
            },
            QUARTERS_THIS_YEAR: {
                displayName: 'Quarters this year',
            },
            QUARTERS_LAST_YEAR: {
                displayName: 'Quarters last year',
            },
            LAST_4_QUARTERS: {
                displayName: 'Last 4 quarters',
            },
        },
    },
    {
        name: 'QuarterlyNov',
        displayName: 'Quarterly November',
        relativePeriods: {
            THIS_QUARTER: {
                displayName: 'This quarter',
            },
            LAST_QUARTER: {
                displayName: 'Last quarter',
            },
            QUARTERS_THIS_YEAR: {
                displayName: 'Quarters this year',
            },
            QUARTERS_LAST_YEAR: {
                displayName: 'Quarters last year',
            },
            LAST_4_QUARTERS: {
                displayName: 'Last 4 quarters',
            },
        },
    },
    {
        name: 'SixMonthly',
        displayName: 'Six-monthly',
        relativePeriods: {
            THIS_SIX_MONTH: {
                displayName: 'This six-month',
            },
            LAST_SIX_MONTH: {
                displayName: 'Last six-month',
            },
            LAST_2_SIXMONTHS: {
                displayName: 'Last 2 six-months',
            },
        },
    },
    {
        name: 'SixMonthlyApril',
        displayName: 'Six-monthly April',
        relativePeriods: {
            THIS_SIX_MONTH: {
                displayName: 'This six-month',
            },
            LAST_SIX_MONTH: {
                displayName: 'Last six-month',
            },
            LAST_2_SIXMONTHS: {
                displayName: 'Last 2 six-months',
            },
        },
    },
    {
        name: 'SixMonthlyNov',
        displayName: 'Six-monthly November',
        relativePeriods: {
            THIS_SIX_MONTH: {
                displayName: 'This six-month',
            },
            LAST_SIX_MONTH: {
                displayName: 'Last six-month',
            },
            LAST_2_SIXMONTHS: {
                displayName: 'Last 2 six-months',
            },
        },
    },
    {
        name: 'Yearly',
        displayName: 'Yearly',
        relativePeriods: {
            THIS_YEAR: {
                displayName: 'This year',
            },
            LAST_YEAR: {
                displayName: 'Last year',
            },
            LAST_5_YEARS: {
                displayName: 'Last 5 years',
            },
            LAST_10_YEARS: {
                displayName: 'Last 10 years',
            },
        },
    },
    {
        name: 'FinancialFeb',
        displayName: 'Financial February',
        relativePeriods: {
            THIS_FINANCIAL_YEAR: {
                displayName: 'This financial year',
            },
            LAST_FINANCIAL_YEAR: {
                displayName: 'Last financial year',
            },
            LAST_5_FINANCIAL_YEARS: {
                displayName: 'Last 5 financial years',
            },
            LAST_10_FINANCIAL_YEARS: {
                displayName: 'LAST_10_FINANCIAL_YEARS',
            },
        },
    },
    {
        name: 'FinancialApril',
        displayName: 'Financial April',
        relativePeriods: {
            THIS_FINANCIAL_YEAR: {
                displayName: 'This financial year',
            },
            LAST_FINANCIAL_YEAR: {
                displayName: 'Last financial year',
            },
            LAST_5_FINANCIAL_YEARS: {
                displayName: 'Last 5 financial years',
            },
            LAST_10_FINANCIAL_YEARS: {
                displayName: 'LAST_10_FINANCIAL_YEARS',
            },
        },
    },
    {
        name: 'FinancialJuly',
        displayName: 'Financial July',
        relativePeriods: {
            THIS_FINANCIAL_YEAR: {
                displayName: 'This financial year',
            },
            LAST_FINANCIAL_YEAR: {
                displayName: 'Last financial year',
            },
            LAST_5_FINANCIAL_YEARS: {
                displayName: 'Last 5 financial years',
            },
            LAST_10_FINANCIAL_YEARS: {
                displayName: 'LAST_10_FINANCIAL_YEARS',
            },
        },
    },
    {
        name: 'FinancialAug',
        displayName: 'Financial August',
        relativePeriods: {
            THIS_FINANCIAL_YEAR: {
                displayName: 'This financial year',
            },
            LAST_FINANCIAL_YEAR: {
                displayName: 'Last financial year',
            },
            LAST_5_FINANCIAL_YEARS: {
                displayName: 'Last 5 financial years',
            },
            LAST_10_FINANCIAL_YEARS: {
                displayName: 'LAST_10_FINANCIAL_YEARS',
            },
        },
    },
    {
        name: 'FinancialSep',
        displayName: 'FinancialSep',
        relativePeriods: {
            THIS_FINANCIAL_YEAR: {
                displayName: 'This financial year',
            },
            LAST_FINANCIAL_YEAR: {
                displayName: 'Last financial year',
            },
            LAST_5_FINANCIAL_YEARS: {
                displayName: 'Last 5 financial years',
            },
            LAST_10_FINANCIAL_YEARS: {
                displayName: 'LAST_10_FINANCIAL_YEARS',
            },
        },
    },
    {
        name: 'FinancialOct',
        displayName: 'Financial October',
        relativePeriods: {
            THIS_FINANCIAL_YEAR: {
                displayName: 'This financial year',
            },
            LAST_FINANCIAL_YEAR: {
                displayName: 'Last financial year',
            },
            LAST_5_FINANCIAL_YEARS: {
                displayName: 'Last 5 financial years',
            },
            LAST_10_FINANCIAL_YEARS: {
                displayName: 'LAST_10_FINANCIAL_YEARS',
            },
        },
    },
    {
        name: 'FinancialNov',
        displayName: 'Financial November',
        relativePeriods: {
            THIS_FINANCIAL_YEAR: {
                displayName: 'This financial year',
            },
            LAST_FINANCIAL_YEAR: {
                displayName: 'Last financial year',
            },
            LAST_5_FINANCIAL_YEARS: {
                displayName: 'Last 5 financial years',
            },
            LAST_10_FINANCIAL_YEARS: {
                displayName: 'LAST_10_FINANCIAL_YEARS',
            },
        },
    },
]
