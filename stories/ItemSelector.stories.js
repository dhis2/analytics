import React from 'react'
import cloneDeep from 'lodash/cloneDeep'
import { storiesOf } from '@storybook/react'
import { State, Store } from '@sambego/storybook-state'

import ItemSelector from '../src/components/ItemSelector/ItemSelector'

const defaultItems = {
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

let items

const updateStore = (store, unselectedIds, selectedIds) => {
    const selected = Object.assign({}, store.get('selected'), {
        items: selectedIds.map(id => items[id]),
    })

    const unselected = Object.assign({}, store.get('unselected'), {
        items: unselectedIds.map(id => items[id]),
    })

    store.set({ selected, unselected })
}

const onSelect = store => newIds => {
    const selectedIds = [
        ...new Set(
            store
                .get('selected')
                .items.map(i => i.id)
                .concat(newIds)
        ),
    ]

    const unselectedIds = Object.keys(items).filter(
        id => !selectedIds.includes(id)
    )

    updateStore(store, unselectedIds, selectedIds)
}

const onDeselect = store => newIds => {
    const unorderedUnselectedIds = [
        ...new Set(newIds.concat(store.get('unselected').items.map(i => i.id))),
    ]

    const unselectedIds = Object.keys(items).filter(id =>
        unorderedUnselectedIds.includes(id)
    )

    const selectedIds = Object.keys(items).filter(
        id => !unselectedIds.includes(id)
    )

    updateStore(store, unselectedIds, selectedIds)
}

const onReorder = store => ids => {
    const selected = Object.assign({}, store.get('selected'), {
        items: ids.map(id => items[id]),
    })

    store.set({ selected })
}

const defaultState = items => ({
    unselected: {
        items: Object.values(items),
        onSelect: Function.prototype,
    },
    selected: {
        items: [],
        onDeselect: Function.prototype,
        onReorder: Function.prototype,
    },
})

storiesOf('ItemSelector', module).add('default', () => {
    items = cloneDeep(defaultItems)

    const state = defaultState(items)
    const store = new Store(state)

    state.unselected.onSelect = onSelect(store)
    state.selected.onDeselect = onDeselect(store)
    state.selected.onReorder = onReorder(store)

    return (
        <State store={store}>
            <ItemSelector />
        </State>
    )
})

storiesOf('ItemSelector', module).add('active/inactive items', () => {
    items = cloneDeep(defaultItems)
    items.rainbow.isActive = false
    items.pinkie.isActive = false

    const state = defaultState(items)
    const store = new Store(state)

    state.unselected.onSelect = onSelect(store)
    state.selected.onDeselect = onDeselect(store)
    state.selected.onReorder = onReorder(store)

    onSelect(store)([items.applejack.id, items.rainbow.id, items.pinkie.id])

    return (
        <State store={store}>
            <ItemSelector />
        </State>
    )
})

storiesOf('ItemSelector', module).add('info box', () => {
    items = cloneDeep(defaultItems)
    items.rainbow.isActive = false

    const state = defaultState(items)
    const store = new Store(state)

    state.unselected.onSelect = onSelect(store)
    state.selected.onDeselect = onDeselect(store)
    state.selected.onReorder = onReorder(store)
    state.selected.infoBoxMessage =
        'This is a custom message that can be passed'

    onSelect(store)([items.applejack.id, items.rainbow.id])

    return (
        <State store={store}>
            <ItemSelector />
        </State>
    )
})
