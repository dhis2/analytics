import React from 'react'
import { storiesOf } from '@storybook/react'

import PeriodDimension from '../components/PeriodDimension/PeriodDimension'

const selectedPeriods = [{ id: 'LAST_12_MONTHS', name: 'Last 12 months' }]

storiesOf('PeriodDimension', module).add('None selected', () => {
    return <PeriodDimension onSelect={selected => console.log(selected)} />
})

storiesOf('PeriodDimension', module).add('One selected', () => {
    return (
        <PeriodDimension
            selectedPeriods={selectedPeriods}
            onSelect={selected => console.log(selected)}
        />
    )
})
