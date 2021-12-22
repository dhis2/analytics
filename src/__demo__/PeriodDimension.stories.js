import { storiesOf } from '@storybook/react'
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

const selectedPeriods = [{ id: 'LAST_12_MONTHS', name: 'Last 12 months' }]

storiesOf('PeriodDimension', module).add('None selected', () => {
    return <PeriodDimension onSelect={(selected) => console.log(selected)} />
})

storiesOf('PeriodDimension', module).add('One selected', () => {
    return (
        <PeriodDimension
            selectedPeriods={selectedPeriods}
            onSelect={(selected) => console.log(selected)}
        />
    )
})

storiesOf('PeriodDimension', module).add('Monthly excluded', () => {
    return (
        <PeriodDimension
            excludedPeriodTypes={[MONTHLY]}
            onSelect={(selected) => console.log(selected)}
        />
    )
})

storiesOf('PeriodDimension', module).add('Weekly excluded', () => {
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
})

storiesOf('PeriodDimension', module).add('All below Quarterly excluded', () => {
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
})

storiesOf('PeriodDimension', module).add('Using right footer', () => {
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
})
