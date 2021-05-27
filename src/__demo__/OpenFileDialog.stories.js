import React from 'react'
import { storiesOf } from '@storybook/react'
import { Provider } from '@dhis2/app-runtime'

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

storiesOf('OpenFileDialog', module).add('List of visualizations', () => (
    <Provider config={configMock}>
        <OpenFileDialog
            type="visualization"
            onClose={Function.prototype}
            onFileSelect={Function.prototype}
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
            onFileSelect={Function.prototype}
            onNew={Function.prototype}
            open={true}
            currentUser={user}
        />
    </Provider>
))
