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
                onFetch={() => ({ dimensionItems: items })}
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
                onFetch={() => ({ dimensionItems: items })}
                initialSelected={[items[2]].map(item => ({
                    value: item.id,
                    label: item.name,
                }))}
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
                onFetch={() => ({ dimensionItems: items })}
                initialSelected={[items[5]].map(item => ({
                    value: item.id,
                    label: item.name,
                }))}
            />
        )
    }
)
