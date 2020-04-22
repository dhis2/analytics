import React from 'react'
import { storiesOf } from '@storybook/react'

import PeriodSelector from '../components/PeriodSelector/PeriodSelector'

storiesOf('PeriodSelector', module).add('default', () => {
    return <PeriodSelector />
})
