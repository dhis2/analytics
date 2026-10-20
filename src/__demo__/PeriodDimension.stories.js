import { CustomDataProvider } from '@dhis2/app-runtime'
import { ConfigProvider } from '@dhis2/app-service-config'
import React from 'react'
import PeriodDimension from '../components/PeriodDimension/PeriodDimension.js'
import {
    MONTHLY,
    WEEKLY,
    WEEKLYWED,
    WEEKLYTHU,
    WEEKLYSAT,
    WEEKLYSUN,
    DAILY,
    BIWEEKLY,
    BIMONTHLY,
} from '../components/PeriodDimension/utils/index.js'
import { periodTypesV44 } from './data/periodTypes.v44.js'

// The period selector has one implementation per server version (42, 43, 44),
// selected by serverVersion.minor. The server responses are mocked.
const withServer = ({ minor, data }) =>
    function MockServer(Story) {
        return (
            <ConfigProvider
                config={{
                    baseUrl: '..',
                    apiVersion: minor,
                    serverVersion: { major: 2, minor, patch: 0 },
                    systemInfo: { calendar: 'gregory' },
                }}
            >
                <CustomDataProvider data={data}>
                    <Story />
                </CustomDataProvider>
            </ConfigProvider>
        )
    }

// Mimics the v44 server: relative period labels are stored per relative
// period and returned under every period type that has the relative period
const applyV44Labels = (
    periodTypes,
    { periodTypeLabels, relativePeriodLabels }
) =>
    periodTypes.map((pt) => ({
        ...pt,
        displayName: periodTypeLabels[pt.name] || pt.displayName,
        relativePeriods: Object.fromEntries(
            Object.entries(pt.relativePeriods).map(([id, rp]) => [
                id,
                { displayName: relativePeriodLabels[id] || rp.displayName },
            ])
        ),
    }))

const v44Data = ({
    // the server returns all period types when none are configured
    enabledPeriodTypes = periodTypesV44.map(({ name }) => name),
    periodTypeLabels = {},
    relativePeriodLabels = {},
    uiLocale = 'en',
    weeklyStart = 'WEEKLY',
    financialYearStart = 'FINANCIAL_YEAR_OCTOBER',
    analysisRelativePeriod = 'LAST_12_MONTHS',
} = {}) => ({
    userSettings: { keyUiLocale: uiLocale },
    'configuration/dataOutputPeriodTypes': applyV44Labels(
        periodTypesV44.filter(({ name }) => enabledPeriodTypes.includes(name)),
        { periodTypeLabels, relativePeriodLabels }
    ),
    'systemSettings/keyAnalysisRelativePeriod': {
        keyAnalysisRelativePeriod: analysisRelativePeriod,
    },
    'systemSettings/analyticsWeeklyStart': {
        analyticsWeeklyStart: weeklyStart,
    },
    'systemSettings/analyticsFinancialYearStart': {
        analyticsFinancialYearStart: financialYearStart,
    },
})

const selectedPeriods = [{ id: 'LAST_12_MONTHS', name: 'Last 12 months' }]

export default {
    title: 'PeriodDimension',
    decorators: [withServer({ minor: 44, data: v44Data() })],
}

export const NoneSelected = () => {
    return <PeriodDimension onSelect={(selected) => console.log(selected)} />
}

NoneSelected.storyName = 'None selected'

export const OneSelected = () => {
    return (
        <PeriodDimension
            selectedPeriods={selectedPeriods}
            onSelect={(selected) => console.log(selected)}
        />
    )
}

OneSelected.storyName = 'One selected'

export const MonthlyExcluded = () => {
    return (
        <PeriodDimension
            excludedPeriodTypes={[MONTHLY]}
            onSelect={(selected) => console.log(selected)}
        />
    )
}

MonthlyExcluded.storyName = 'Monthly excluded'

export const WeeklyExcluded = () => {
    return (
        <PeriodDimension
            excludedPeriodTypes={[
                WEEKLY,
                WEEKLYWED,
                WEEKLYTHU,
                WEEKLYSAT,
                WEEKLYSUN,
            ]}
            onSelect={(selected) => console.log(selected)}
        />
    )
}

WeeklyExcluded.storyName = 'Weekly excluded'

export const AllBelowQuarterlyExcluded = () => {
    return (
        <PeriodDimension
            excludedPeriodTypes={[
                DAILY,
                WEEKLY,
                WEEKLYWED,
                WEEKLYTHU,
                WEEKLYSAT,
                WEEKLYSUN,
                BIWEEKLY,
                MONTHLY,
                BIMONTHLY,
            ]}
            onSelect={(selected) => console.log(selected)}
        />
    )
}

AllBelowQuarterlyExcluded.storyName = 'All below Quarterly excluded'

export const UsingRightFooter = () => {
    return (
        <PeriodDimension
            rightFooter={
                <div
                    style={{
                        padding: '8px',
                        margin: '8px 0',
                        border: '1px solid #f79533',
                    }}
                >
                    <p>Right footer goes here</p>
                </div>
            }
            onSelect={(selected) => console.log(selected)}
        />
    )
}

UsingRightFooter.storyName = 'Using right footer'

export const V44CustomLabels = () => {
    return (
        <PeriodDimension
            // stored name of a saved visualization is replaced by the label
            selectedPeriods={[{ id: 'LAST_4_WEEKS', name: 'Last 4 weeks' }]}
            onSelect={(selected) => console.log(selected)}
        />
    )
}

V44CustomLabels.storyName =
    'v44: custom labels, only Weekly Sunday and Financial April enabled'
V44CustomLabels.decorators = [
    withServer({
        minor: 44,
        data: v44Data({
            enabledPeriodTypes: [
                'Daily',
                'WeeklySunday',
                'Monthly',
                'Quarterly',
                'Yearly',
                'FinancialApril',
            ],
            weeklyStart: 'WEEKLY_SUNDAY',
            financialYearStart: 'FINANCIAL_YEAR_APRIL',
            // opens the weekly relative periods
            analysisRelativePeriod: 'LAST_4_WEEKS',
            periodTypeLabels: {
                WeeklySunday: 'EPI week',
                FinancialApril: 'Fiscal year',
            },
            relativePeriodLabels: {
                THIS_WEEK: 'This EPI week',
                LAST_WEEK: 'Last EPI week',
                LAST_4_WEEKS: 'Last 4 EPI weeks',
                LAST_12_WEEKS: 'Last 12 EPI weeks',
                LAST_52_WEEKS: 'Last 52 EPI weeks',
                WEEKS_THIS_YEAR: 'EPI weeks this year',
                THIS_FINANCIAL_YEAR: 'This fiscal year',
                LAST_FINANCIAL_YEAR: 'Last fiscal year',
                LAST_5_FINANCIAL_YEARS: 'Last 5 fiscal years',
                LAST_10_FINANCIAL_YEARS: 'Last 10 fiscal years',
            },
        }),
    }),
]

export const V44Translated = () => {
    return (
        <PeriodDimension
            // stored name of a saved visualization is replaced by the translation
            selectedPeriods={[{ id: 'LAST_12_MONTHS', name: 'Last 12 months' }]}
            onSelect={(selected) => console.log(selected)}
        />
    )
}

V44Translated.storyName = 'v44: label translations (ui locale fr)'
V44Translated.decorators = [
    withServer({
        minor: 44,
        data: v44Data({
            uiLocale: 'fr',
            enabledPeriodTypes: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
            periodTypeLabels: {
                Daily: 'Quotidien',
                Weekly: 'Hebdomadaire',
                Monthly: 'Mensuel',
                Yearly: 'Annuel',
            },
            relativePeriodLabels: {
                TODAY: "Aujourd'hui",
                YESTERDAY: 'Hier',
                THIS_WEEK: 'Cette semaine',
                LAST_WEEK: 'La semaine dernière',
                THIS_MONTH: 'Ce mois-ci',
                LAST_MONTH: 'Le mois dernier',
                LAST_3_MONTHS: '3 derniers mois',
                LAST_6_MONTHS: '6 derniers mois',
                LAST_12_MONTHS: '12 derniers mois',
                THIS_YEAR: 'Cette année',
                LAST_YEAR: "L'année dernière",
            },
        }),
    }),
]

export const V44WeeklyStartDisabled = () => {
    return <PeriodDimension onSelect={(selected) => console.log(selected)} />
}

V44WeeklyStartDisabled.storyName =
    'v44: weekly start Sunday, but only Weekly enabled (no weekly relative periods)'
V44WeeklyStartDisabled.decorators = [
    withServer({
        minor: 44,
        data: v44Data({
            enabledPeriodTypes: ['Weekly', 'Monthly'],
            weeklyStart: 'WEEKLY_SUNDAY',
        }),
    }),
]

export const V43Labels = () => {
    return <PeriodDimension onSelect={(selected) => console.log(selected)} />
}

V43Labels.storyName =
    'v43: period type labels, relative period names derived from them'
V43Labels.decorators = [
    withServer({
        minor: 43,
        data: {
            userSettings: { keyUiLocale: 'en' },
            'configuration/dataOutputPeriodTypes': [
                { name: 'Daily' },
                { name: 'WeeklySunday', displayLabel: 'EPI week' },
                { name: 'Monthly' },
                { name: 'Quarterly' },
                { name: 'Yearly' },
                { name: 'FinancialApril', displayLabel: 'Fiscal year' },
            ],
            'systemSettings/keyAnalysisRelativePeriod': {
                keyAnalysisRelativePeriod: 'LAST_12_MONTHS',
            },
            'systemSettings/analyticsWeeklyStart': {
                analyticsWeeklyStart: 'WEEKLY_SUNDAY',
            },
            'systemSettings/analyticsFinancialYearStart': {
                analyticsFinancialYearStart: 'FINANCIAL_YEAR_APRIL',
            },
        },
    }),
]

export const V42 = () => {
    return <PeriodDimension onSelect={(selected) => console.log(selected)} />
}

V42.storyName = 'v42: client period types and relative periods'
V42.decorators = [
    withServer({
        minor: 42,
        data: { userSettings: { keyUiLocale: 'en' } },
    }),
]
