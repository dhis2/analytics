import React from 'react'
import ItemSelector from '../components/DynamicDimension/ItemSelector.js'

const items = [
    { id: '1', name: 'One' },
    { id: '2', name: 'Two' },
    { id: '3', name: 'Three' },
    { id: '4', name: 'Four' },
    { id: '5', name: 'Five' },
    { id: '6', name: 'Six - disabled', disabled: true },
]

export default {
    title: 'DynamicDimension',
}

export const ItemSelectorNoItemsSelected = () => {
    return (
        <ItemSelector
            onSelect={(selected) => console.log(selected)}
            onFetch={() => ({ dimensionItems: items })}
        />
    )
}

ItemSelectorNoItemsSelected.story = {
    name: 'ItemSelector no items selected',
}

export const ItemSelectorOneItemSelected = () => {
    return (
        <ItemSelector
            onSelect={(selected) => console.log(selected)}
            onFetch={() => ({ dimensionItems: items })}
            initialSelected={[items[2]].map((item) => ({
                value: item.id,
                label: item.name,
            }))}
        />
    )
}

ItemSelectorOneItemSelected.story = {
    name: 'ItemSelector one item selected',
}

export const ItemSelectorDisabledItemSelected = () => {
    return (
        <ItemSelector
            onSelect={(selected) => console.log(selected)}
            onFetch={() => ({ dimensionItems: items })}
            initialSelected={[items[5]].map((item) => ({
                value: item.id,
                label: item.name,
            }))}
        />
    )
}

ItemSelectorDisabledItemSelected.story = {
    name: 'ItemSelector disabled item selected',
}

