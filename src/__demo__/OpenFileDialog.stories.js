import { Provider } from '@dhis2/app-runtime'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { OpenFileDialog } from '../components/OpenFileDialog/OpenFileDialog.js'
import {
    VIS_TYPE_GROUP_ALL,
    VIS_TYPE_GROUP_CHARTS,
    VIS_TYPE_PIVOT_TABLE,
    VIS_TYPE_COLUMN,
    VIS_TYPE_STACKED_COLUMN,
    VIS_TYPE_BAR,
    VIS_TYPE_STACKED_BAR,
    VIS_TYPE_LINE,
    VIS_TYPE_LINE_LIST,
    VIS_TYPE_AREA,
    VIS_TYPE_STACKED_AREA,
    VIS_TYPE_PIE,
    VIS_TYPE_RADAR,
    VIS_TYPE_GAUGE,
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_SINGLE_VALUE,
    VIS_TYPE_SCATTER,
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
    { type: VIS_TYPE_STACKED_COLUMN },
    { type: VIS_TYPE_BAR },
    { type: VIS_TYPE_STACKED_BAR },
    { type: VIS_TYPE_LINE },
    { type: VIS_TYPE_AREA },
    { type: VIS_TYPE_STACKED_AREA },
    { type: VIS_TYPE_PIE },
    { type: VIS_TYPE_RADAR },
    { type: VIS_TYPE_GAUGE },
    { type: VIS_TYPE_YEAR_OVER_YEAR_LINE },
    { type: VIS_TYPE_YEAR_OVER_YEAR_COLUMN },
    { type: VIS_TYPE_SINGLE_VALUE },
    { type: VIS_TYPE_SCATTER },
]

storiesOf('OpenFileDialog', module).add(
    'List of visualizations with vis type filter and divider',
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
    'List of event visualizations with vis type filter and disabled type',
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
