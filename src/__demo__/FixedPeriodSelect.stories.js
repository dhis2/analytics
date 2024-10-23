import React, { useState } from 'react'
import FixedPeriodSelect from '../components/PeriodDimension/FixedPeriodSelect.js'

export default {
    title: 'FixedPeriodSelect',
}

export const NoValue = () => {
    const [value, setValue] = useState()
    return (
        <FixedPeriodSelect
            onChange={(period) => setValue(period?.id)}
            value={value}
        />
    )
}

NoValue.story = {
    name: 'No value',
}

export const WithValue = () => {
    const [value, setValue] = useState('20140304')
    return (
        <FixedPeriodSelect
            onChange={(period) => setValue(period?.id)}
            value={value}
        />
    )
}

WithValue.story = {
    name: 'With value',
}

export const AllowedPeriodTypes = () => {
    const [value, setValue] = useState('20140304')
    return (
        <FixedPeriodSelect
            onChange={(period) => setValue(period?.id)}
            value={value}
            allowedPeriodTypes={['MONTHLY', 'DAILY', 'YEARLY']}
        />
    )
}

AllowedPeriodTypes.story = {
    name: 'Allowed period types',
}

