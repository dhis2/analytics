import React from 'react'
import { storiesOf } from '@storybook/react'

import PeriodDimension from '../src/components/PeriodDimension/PeriodDimension'

storiesOf('PeriodDimension', module).add('default', () => {
    return <PeriodDimension />
})
