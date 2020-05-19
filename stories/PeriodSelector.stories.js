import React from 'react'
import { storiesOf } from '@storybook/react'

import PeriodSelector from '../src/components/PeriodSelector/PeriodSelector'

storiesOf('PeriodSelector', module).add('default', () => {
    return <PeriodSelector />
})
