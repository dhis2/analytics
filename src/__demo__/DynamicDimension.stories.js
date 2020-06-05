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
            initialSelectedItemIds={[items[2].id]}
        />
    )
})

storiesOf('DynamicDimension', module).add(
    'ItemSelector one selected not in options',
    () => {
        return (
            <>
                <ItemSelector
                    onSelect={selected => console.log(selected)}
                    allItems={items}
                    initialSelectedItemIds={['6']}
                />
                <p>
                    Note: This currently does not work as ui (currently @5.0.1)
                    does not yet support selected items that are not part of the
                    options array{' '}
                    <a href="https://jira.dhis2.org/browse/TECH-380">
                        https://jira.dhis2.org/browse/TECH-380
                    </a>
                </p>
            </>
            // TODO: fix the issue above
        )
    }
)
