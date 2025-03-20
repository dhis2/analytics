import { Provider } from '@dhis2/app-runtime'
import React from 'react'
import { FileMenu } from '../components/FileMenu/FileMenu.js'
import { HoverMenuBar } from '../components/Toolbar/index.js'

const configMock = {
    baseUrl: 'http://localhost:8080',
    apiVersion: 33,
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
    name: 'ANC: 1-3 dropout rate Yearly',
    displayDescription: 'some _italic (10%)_ and some *bold (10%)*',
    displayName: 'ANC: 1-3 dropout rate Yearly',
    description: 'some _italic (10%)_ and some *bold (10%)*',
    access: {
        read: true,
        update: true,
        externalize: true,
        delete: true,
        write: true,
        manage: true,
    },
    lastUpdatedBy: user,
    user,
    translations: [],
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

export default {
    title: 'FileMenu',
}

export const Simple = () => (
    <Provider config={configMock}>
        <HoverMenuBar>
            <FileMenu currentUser={user} fileType="visualization" />
        </HoverMenuBar>
    </Provider>
)

export const WithAo = () => (
    <Provider config={configMock}>
        <HoverMenuBar>
            <FileMenu
                currentUser={user}
                fileType="visualization"
                fileObject={visObject}
            />
        </HoverMenuBar>
    </Provider>
)

WithAo.story = {
    name: 'With AO',
}

export const WithReadonlyAo = () => (
    <Provider config={configMock}>
        <HoverMenuBar>
            <FileMenu
                currentUser={user}
                fileType="visualization"
                fileObject={visReadonlyObject}
            />
        </HoverMenuBar>
    </Provider>
)

WithReadonlyAo.story = {
    name: 'With readonly AO',
}
