import { DataProvider } from '@dhis2/app-runtime'
import { ConfigProvider } from '@dhis2/app-service-config'
import React from 'react'
import PeriodDimension from '../components/PeriodDimension/PeriodDimension.jsx'
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

const Wrapper = (story) => (
    <ConfigProvider config={{ systemInfo: {} }}>
        <DataProvider
            baseUrl="https://test.e2e.dhis2.org/analytics-41dev/"
            apiVersion="41"
        >
            {story()}
        </DataProvider>
    </ConfigProvider>
)

const selectedPeriods = [{ id: 'LAST_12_MONTHS', name: 'Last 12 months' }]

export default {
    title: 'PeriodDimension',
    decorators: [Wrapper],
}

export const NoneSelected = () => {
    return <PeriodDimension onSelect={(selected) => console.log(selected)} />
}

NoneSelected.story = {
    name: 'None selected',
}

export const OneSelected = () => {
    return (
        <PeriodDimension
            selectedPeriods={selectedPeriods}
            onSelect={(selected) => console.log(selected)}
        />
    )
}

OneSelected.story = {
    name: 'One selected',
}

export const MonthlyExcluded = () => {
    return (
        <PeriodDimension
            excludedPeriodTypes={[MONTHLY]}
            onSelect={(selected) => console.log(selected)}
        />
    )
}

MonthlyExcluded.story = {
    name: 'Monthly excluded',
}

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

WeeklyExcluded.story = {
    name: 'Weekly excluded',
}

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

AllBelowQuarterlyExcluded.story = {
    name: 'All below Quarterly excluded',
}

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

UsingRightFooter.story = {
    name: 'Using right footer',
}
