import { Provider } from '@dhis2/app-runtime'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { OpenFileDialog } from '../components/OpenFileDialog/OpenFileDialog.js'
import {
    VIS_TYPE_GROUP_ALL,
    VIS_TYPE_GROUP_CHARTS,
    VIS_TYPE_PIVOT_TABLE,
    VIS_TYPE_COLUMN,
    VIS_TYPE_BAR,
    VIS_TYPE_LINE_LIST,
} from '../modules/visTypes.js'

const configMock = {
    baseUrl: 'https://debug.dhis2.org/dev',
    apiVersion: 37,
}

const user = {
    displayName: 'John Traore',
    id: 'xE7jOejl9FI',
    username: 'admin',
}

const onFileSelect = (id) => alert(`Opening ${id}`)

const DVfilterVisTypes = [
    { type: VIS_TYPE_GROUP_ALL },
    { type: VIS_TYPE_GROUP_CHARTS, insertDivider: true },
    { type: VIS_TYPE_PIVOT_TABLE },
    { type: VIS_TYPE_COLUMN },
    { type: VIS_TYPE_BAR },
]

storiesOf('OpenFileDialog', module).add(
    'List of visualizations with vis type filter and divider (no default vis type)',
    () => (
        <Provider config={configMock}>
            <OpenFileDialog
                type="visualization"
                filterVisTypes={DVfilterVisTypes}
                onClose={Function.prototype}
                onFileSelect={onFileSelect}
                onNew={Function.prototype}
                open={true}
                currentUser={user}
            />
        </Provider>
    )
)
storiesOf('OpenFileDialog', module).add(
    'List of maps (no vis type filter)',
    () => (
        <Provider config={configMock}>
            <OpenFileDialog
                type="map"
                onClose={Function.prototype}
                onFileSelect={onFileSelect}
                onNew={Function.prototype}
                open={true}
                currentUser={user}
            />
        </Provider>
    )
)

const EVfilterVisTypes = [
    { type: VIS_TYPE_PIVOT_TABLE, disabled: true },
    { type: VIS_TYPE_LINE_LIST },
]

storiesOf('OpenFileDialog', module).add(
    'List of event visualizations with vis type filter, disabled type and default vis type',
    () => (
        <Provider config={configMock}>
            <OpenFileDialog
                type="eventVisualization"
                filterVisTypes={EVfilterVisTypes}
                defaultFilterVisType={VIS_TYPE_LINE_LIST}
                onClose={Function.prototype}
                onFileSelect={onFileSelect}
                onNew={Function.prototype}
                open={true}
                currentUser={user}
            />
        </Provider>
    )
)

const filterVisTypesTestCase1 = [
    { type: VIS_TYPE_GROUP_ALL },
    { type: VIS_TYPE_BAR, insertDivider: true },
    { type: VIS_TYPE_COLUMN, disabled: true },
]

storiesOf('OpenFileDialog', module).add(
    'List of visualizations with vis type filter with group type, divider and disabled option (no default vis type)',
    () => (
        <Provider config={configMock}>
            <OpenFileDialog
                type="visualization"
                filterVisTypes={filterVisTypesTestCase1}
                onClose={Function.prototype}
                onFileSelect={onFileSelect}
                onNew={Function.prototype}
                open={true}
                currentUser={user}
            />
        </Provider>
    )
)

storiesOf('OpenFileDialog', module).add('No connection', () => (
    <OpenFileDialog
        type="map"
        onClose={Function.prototype}
        onFileSelect={onFileSelect}
        onNew={Function.prototype}
        open={true}
        currentUser={user}
    />
))
