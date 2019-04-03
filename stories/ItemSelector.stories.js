import React from 'react'
import { storiesOf } from '@storybook/react'
import { State, Store } from '@sambego/storybook-state'

import ItemSelector from '../src/ItemSelector'

const items = {
    rarity: {
        id: 'rarity',
        name: 'Rarity',
    },
    rainbow: {
        id: 'rainbow',
        name: 'Rainbow Dash',
    },
    fluttershy: {
        id: 'fluttershy',
        name: 'Fluttershy is a little yellow horse with pink mane and tail',
    },
    pinkie: {
        id: 'pinkie',
        name: 'Pinkie Pie',
    },
    applejack: {
        id: 'applejack',
        name: 'Applejack',
    },
    spike: {
        id: 'spike',
        name: 'Spike',
    },
}

let store

const onSelect = newIds => {
    const selectedIds = [
        ...new Set(newIds.concat(store.get('selected').items.map(i => i.id))),
    ]

    const unselectedIds = Object.keys(items).filter(
        id => !selectedIds.includes(id)
    )

    const selected = Object.assign({}, store.get('selected'), {
        items: selectedIds.map(id => items[id]),
    })

    const unselected = Object.assign({}, store.get('unselected'), {
        items: unselectedIds.map(id => items[id]),
    })

    store.set({ selected, unselected })
}

const onDeselect = newIds => {
    const unselectedIds = [
        ...new Set(newIds.concat(store.get('unselected').items.map(i => i.id))),
    ]

    const selectedIds = Object.keys(items).filter(
        id => !unselectedIds.includes(id)
    )

    const selected = Object.assign({}, store.get('selected'), {
        items: selectedIds.map(id => items[id]),
    })

    const unselected = Object.assign({}, store.get('unselected'), {
        items: unselectedIds.map(id => items[id]),
    })

    store.set({ selected, unselected })
}

const onReorder = ids => {
    const selected = Object.assign({}, store.get('selected'), {
        items: ids.map(id => items[id]),
    })

    store.set({ selected })
}

store = new Store({
    unselected: {
        items: Object.keys(items).map(id => items[id]),
        onSelect: onSelect,
    },
    selected: {
        items: [],
        onDeselect: onDeselect,
        onReorder: onReorder,
    },
})

storiesOf('ItemSelector', module).add('with state', () => (
    <State store={store}>
        <ItemSelector />
    </State>
))
