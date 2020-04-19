import React from 'react'
// import cloneDeep from 'lodash/cloneDeep'
import { storiesOf } from '@storybook/react'
// import { State, Store } from '@sambego/storybook-state'

import { PeriodSelector } from '../index'

// const updateStore = (store, unselectedIds, selectedIds) => {
//     const selected = Object.assign({}, store.get('selected'), {
//         items: selectedIds.map(id => items[id]),
//     })

//     const unselected = Object.assign({}, store.get('unselected'), {
//         items: unselectedIds.map(id => items[id]),
//     })

//     store.set({ selected, unselected })
// }

// const onSelect = store => newIds => {
//     const selectedIds = [
//         ...new Set(
//             store
//                 .get('selected')
//                 .items.map(i => i.id)
//                 .concat(newIds)
//         ),
//     ]

//     const unselectedIds = Object.keys(items).filter(
//         id => !selectedIds.includes(id)
//     )

//     updateStore(store, unselectedIds, selectedIds)
// }

// const onDeselect = store => newIds => {
//     const unorderedUnselectedIds = [
//         ...new Set(newIds.concat(store.get('unselected').items.map(i => i.id))),
//     ]

//     const unselectedIds = Object.keys(items).filter(id =>
//         unorderedUnselectedIds.includes(id)
//     )

//     const selectedIds = Object.keys(items).filter(
//         id => !unselectedIds.includes(id)
//     )

//     updateStore(store, unselectedIds, selectedIds)
// }

// const onReorder = store => ids => {
//     const selected = Object.assign({}, store.get('selected'), {
//         items: ids.map(id => items[id]),
//     })

//     store.set({ selected })
// }

// const defaultState = () => ({
//     onDeselect: () => console.log('deselcted it'),
//     onReorder: () => console.log('reorder'),
//     onSelect: () => console.log('select'),
//     selectedItems: [],
// })

storiesOf('PeriodSelector', module).add('default', () => {
    // items = cloneDeep(defaultItems)

    // const state = defaultState(items)
    // const store = new Store(state)

    // state.unselected.onSelect = onSelect(store)
    // state.selected.onDeselect = onDeselect(store)
    // state.selected.onReorder = onReorder(store)

    return (
        // <State store={store}>
        <PeriodSelector />
        // </State>
    )
})

// storiesOf('PeriodSelector', module).add('active/inactive items', () => {
//     items = cloneDeep(defaultItems)
//     items.rainbow.isActive = false
//     items.pinkie.isActive = false

//     const state = defaultState(items)
//     const store = new Store(state)

//     state.unselected.onSelect = onSelect(store)
//     state.selected.onDeselect = onDeselect(store)
//     state.selected.onReorder = onReorder(store)

//     onSelect(store)([items.applejack.id, items.rainbow.id, items.pinkie.id])

//     return (
//         <State store={store}>
//             <ItemSelector />
//         </State>
//     )
// })

// storiesOf('ItemSelector', module).add('info box', () => {
//     items = cloneDeep(defaultItems)
//     items.rainbow.isActive = false

//     const state = defaultState(items)
//     const store = new Store(state)

//     state.unselected.onSelect = onSelect(store)
//     state.selected.onDeselect = onDeselect(store)
//     state.selected.onReorder = onReorder(store)
//     state.selected.infoBoxMessage =
//         'This is a custom message that can be passed'

//     onSelect(store)([items.applejack.id, items.rainbow.id])

//     return (
//         <State store={store}>
//             <ItemSelector />
//         </State>
//     )
// })
