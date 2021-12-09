import { Provider } from '@dhis2/app-runtime'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { OpenFileDialog } from '../components/OpenFileDialog/OpenFileDialog.js'

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

storiesOf('OpenFileDialog', module).add('List of visualizations', () => (
    <Provider config={configMock}>
        <OpenFileDialog
            type="visualization"
            onClose={Function.prototype}
            onFileSelect={onFileSelect}
            onNew={Function.prototype}
            open={true}
            currentUser={user}
        />
    </Provider>
))
storiesOf('OpenFileDialog', module).add('List of maps', () => (
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
))
storiesOf('OpenFileDialog', module).add(
    'List of event reports (Line list only)',
    () => (
        <Provider config={configMock}>
            <OpenFileDialog
                type="eventReport"
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
    'List of a supported type without custom titles/texts',
    () => (
        <Provider config={configMock}>
            <OpenFileDialog
                type="eventChart"
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
