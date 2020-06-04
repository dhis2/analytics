import React from 'react'
import { storiesOf } from '@storybook/react'

import ItemSelector from '../components/DynamicDimension/ItemSelector'

const items = [
    { id: '1', name: 'One' },
    { id: '2', name: 'Two' },
]

storiesOf('DynamicDimension', module).add('ItemSelector', () => {
    return (
        <ItemSelector
            onSelect={selected => console.log(selected)}
            allItems={items}
        />
    )
})
