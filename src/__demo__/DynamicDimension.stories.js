import React from 'react'
import { storiesOf } from '@storybook/react'

import ItemSelector from '../components/DynamicDimension/ItemSelector'

const items = [
    { id: '1', name: 'One' },
    { id: '2', name: 'Two' },
    { id: '3', name: 'Three' },
    { id: '4', name: 'Four' },
    { id: '5', name: 'Five' },
    { id: '6', name: 'Six - disabled', disabled: true },
]

storiesOf('DynamicDimension', module).add(
    'ItemSelector no items selected',
    () => {
        return (
            <ItemSelector
                onSelect={selected => console.log(selected)}
                allItems={items}
            />
        )
    }
)

storiesOf('DynamicDimension', module).add(
    'ItemSelector one item selected',
    () => {
        return (
            <ItemSelector
                onSelect={selected => console.log(selected)}
                allItems={items}
                initialSelectedItemIds={[items[2].id]}
            />
        )
    }
)

storiesOf('DynamicDimension', module).add(
    'ItemSelector disabled item selected',
    () => {
        return (
            <ItemSelector
                onSelect={selected => console.log(selected)}
                allItems={items}
                initialSelectedItemIds={[items[5].id]}
            />
        )
    }
)
