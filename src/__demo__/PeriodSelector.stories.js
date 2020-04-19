import React from 'react'
import { storiesOf } from '@storybook/react'

import { PeriodSelector } from '../index'

storiesOf('PeriodSelector', module).add('default', () => {
    return <PeriodSelector />
})
