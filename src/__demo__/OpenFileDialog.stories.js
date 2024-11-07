import { DataProvider } from '@dhis2/app-runtime'
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

const Wrapper = (story) => (
    <DataProvider
        baseUrl="https://test.e2e.dhis2.org/analytics-41dev/"
        apiVersion="41"
    >
        {story()}
    </DataProvider>
)

const user = {
    displayName: 'John Traore',
    id: 'xE7jOejl9FI',
    username: 'admin',
}

const onFileSelect = (id) => alert(`Opening ${id}`)

const filterVisTypesWithGroupsAndDivider = [
    { type: VIS_TYPE_GROUP_ALL },
    { type: VIS_TYPE_GROUP_CHARTS, insertDivider: true },
    { type: VIS_TYPE_PIVOT_TABLE },
    { type: VIS_TYPE_COLUMN },
    { type: VIS_TYPE_BAR },
]

export default {
    title: 'OpenFileDialog',
    decorators: [Wrapper],
}

export const ListOfVisualizationsWithVisTypeFilterAndDividerNoDefaultVisType =
    () => (
        <OpenFileDialog
            type="visualization"
            filterVisTypes={filterVisTypesWithGroupsAndDivider}
            onClose={Function.prototype}
            onFileSelect={onFileSelect}
            onNew={Function.prototype}
            open={true}
            currentUser={user}
        />
    )

ListOfVisualizationsWithVisTypeFilterAndDividerNoDefaultVisType.story = {
    name: 'List of visualizations with vis type filter and divider (no default vis type)',
}

export const ListOfMapsNoVisTypeFilter = () => (
    <OpenFileDialog
        type="map"
        onClose={Function.prototype}
        onFileSelect={onFileSelect}
        onNew={Function.prototype}
        open={true}
        currentUser={user}
    />
)

ListOfMapsNoVisTypeFilter.story = {
    name: 'List of maps (no vis type filter)',
}

const filterVisTypesWithDisabled = [
    { type: VIS_TYPE_PIVOT_TABLE, disabled: true },
    { type: VIS_TYPE_LINE_LIST },
]

export const ListOfEventVisualizationsWithVisTypeFilterDisabledTypeAndDefaultVisType =
    () => (
        <OpenFileDialog
            type="eventVisualization"
            filterVisTypes={filterVisTypesWithDisabled}
            defaultFilterVisType={VIS_TYPE_LINE_LIST}
            onClose={Function.prototype}
            onFileSelect={onFileSelect}
            onNew={Function.prototype}
            open={true}
            currentUser={user}
        />
    )

ListOfEventVisualizationsWithVisTypeFilterDisabledTypeAndDefaultVisType.story =
    {
        name: 'List of event visualizations with vis type filter, disabled type and default vis type',
    }

const filterVisTypesWithGroupDividerAndDisabled = [
    { type: VIS_TYPE_GROUP_ALL },
    { type: VIS_TYPE_BAR, insertDivider: true },
    { type: VIS_TYPE_COLUMN, disabled: true },
]

export const ListOfVisualizationsWithVisTypeFilterWithGroupTypeDividerAndDisabledOptionNoDefaultVisType =
    () => (
        <OpenFileDialog
            type="visualization"
            filterVisTypes={filterVisTypesWithGroupDividerAndDisabled}
            onClose={Function.prototype}
            onFileSelect={onFileSelect}
            onNew={Function.prototype}
            open={true}
            currentUser={user}
        />
    )

ListOfVisualizationsWithVisTypeFilterWithGroupTypeDividerAndDisabledOptionNoDefaultVisType.story =
    {
        name: 'List of visualizations with vis type filter with group type, divider and disabled option (no default vis type)',
    }

export const NoConnection = () => (
    <OpenFileDialog
        type="map"
        onClose={Function.prototype}
        onFileSelect={onFileSelect}
        onNew={Function.prototype}
        open={true}
        currentUser={user}
    />
)

NoConnection.story = {
    name: 'No connection',
}
