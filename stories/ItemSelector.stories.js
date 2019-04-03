import React from 'react'

import { storiesOf } from '@storybook/react'
import ItemSelector from '../src/ItemSelector'

const style = {
    fontFamily: 'Roboto',
}

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

const state = {
    unselectedItems: Object.keys(items),
    selectedItems: [],
}

const onSelect = newItems => {
    console.log('onSelect')

    // const selectedItems = [...(new Set(newItems.concat(state.selectedItems)))];
    // const unselectedItems = Object.keys(items)
    //     .filter(id => !selectedItems.includes(id));

    // this.setState({ selectedItems, unselectedItems })
}

const onDeselect = newItems => {
    console.log('onDeselect')
    // const unselectedItems = [...(new Set(newItems.concat(this.state.unselectedItems)))];
    // const selectedItems = Object.keys(items)
    //     .filter(id => !unselectedItems.includes(id));

    // this.setState({ selectedItems, unselectedItems })
}

const onReorder = selectedItems => {
    console.log('onReorder')
    // this.setState({ selectedItems });
}

const unselected = {
    items: state.unselectedItems.map(id => items[id]),
    onSelect: onSelect,
}

const selected = {
    items: state.selectedItems.map(id => items[id]),
    onDeselect: onDeselect,
    onReorder: onReorder,
}

storiesOf('ItemSelector', module).add('Default', () => (
    <ItemSelector unselected={unselected} selected={selected} />
))
