import { Provider } from '@dhis2/app-runtime'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { FileMenu } from '../components/FileMenu/FileMenu.js'

const configMock = {
    baseUrl: 'http://localhost:8080',
    apiVersion: 33,
}

const d2Mock = {
    i18n: {
        getTranslation: string => string,
    },
}

const user = {
    displayName: 'John Traore',
    id: 'xE7jOejl9FI',
    username: 'admin',
}

const visObject = {
    lastUpdated: '2020-10-12T09:44:46.194',
    href: 'http://localhost:8080/api/32/visualizations/a8LrqsBQlHP',
    id: 'a8LrqsBQlHP',
    created: '2012-11-05T09:17:23.388',
    name: 'ANC: 1-3 dropout rate Yearly copy1',
    publicAccess: '--------',
    displayDescription: 'some _italic (10%)_ and some *bold (10%)*',
    displayName: 'ANC: 1-3 dropout rate Yearly copy1',
    description: 'some _italic (10%)_ and some *bold (10%)*',
    externalAccess: false,
    access: {
        read: true,
        update: true,
        externalize: true,
        delete: true,
        write: true,
        manage: true,
    },
    lastUpdatedBy: {
        displayName: 'John Traore',
        id: 'xE7jOejl9FI',
        username: 'admin',
    },
    user: { displayName: 'John Traore', id: 'xE7jOejl9FI', username: 'admin' },
    translations: [],
    userAccesses: [
        {
            access: 'rw------',
            displayName: 'John Barnes',
            id: 'DXyJmlo9rge',
            userUid: 'DXyJmlo9rge',
        },
    ],
}

const visReadonlyObject = {
    ...visObject,
    access: {
        read: true,
        update: false,
        externalize: false,
        delete: false,
        write: false,
        manage: false,
    },
}

storiesOf('FileMenu', module)
    .add('Simple', () => (
        <FileMenu d2={d2Mock} currentUser={user} fileType="visualization" />
    ))
    .add('With AO', () => (
        <Provider config={configMock}>
            <FileMenu
                d2={d2Mock}
                currentUser={user}
                fileType="visualization"
                fileObject={visObject}
            />
        </Provider>
    ))
    .add('With readonly AO', () => (
        <Provider config={configMock}>
            <FileMenu
                d2={d2Mock}
                currentUser={user}
                fileType="visualization"
                fileObject={visReadonlyObject}
            />
        </Provider>
    ))
