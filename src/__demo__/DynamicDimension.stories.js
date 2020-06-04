import React from 'react'
import { storiesOf } from '@storybook/react'

import ItemSelector from '../components/DynamicDimension/ItemSelector'

const items = [
    { id: '1', name: 'One' },
    { id: '2', name: 'Two' },
    { id: '3', name: 'Three' },
    { id: '4', name: 'Four' },
    { id: '5', name: 'Five' },
]

storiesOf('DynamicDimension', module).add('ItemSelector none selected', () => {
    return (
        <ItemSelector
            onSelect={selected => console.log(selected)}
            allItems={items}
        />
    )
})

storiesOf('DynamicDimension', module).add('ItemSelector one selected', () => {
    return (
        <ItemSelector
            onSelect={selected => console.log(selected)}
            allItems={items}
            initialSelectedItems={[{ id: '2', name: 'Two' }]}
        />
    )
})

storiesOf('DynamicDimension', module).add(
    'ItemSelector one selected not in options',
    () => {
        return (
            <ItemSelector
                onSelect={selected => console.log(selected)}
                allItems={items}
                initialSelectedItems={[{ id: '6', name: 'Six' }]}
            />
        )
    }
)
