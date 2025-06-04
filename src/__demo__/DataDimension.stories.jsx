import { DataProvider } from '@dhis2/app-runtime'
import { ConfigProvider } from '@dhis2/app-service-config'
import React, { useState } from 'react'
import DataDimension from '../components/DataDimension/DataDimension.jsx'

const Wrapper = (story) => (
    <ConfigProvider config={{ serverVersion: { major: 2, minor: 41 } }}>
        <DataProvider
            baseUrl="https://test.e2e.dhis2.org/analytics-41dev"
            apiVersion="41"
        >
            {story()}
        </DataProvider>
    </ConfigProvider>
)

export default {
    title: 'DataDimension',
    decorators: [Wrapper],
}

export const NoneSelected = () => {
    const [selected, setSelected] = useState([])

    return (
        <DataDimension
            displayNameProp="displayName"
            selectedDimensions={selected}
            onSelect={(response) => setSelected(response.items)}
        />
    )
}

NoneSelected.story = {
    name: 'None selected',
}

export const WithInfoBoxMessage = () => {
    const [selected, setSelected] = useState([])

    return (
        <DataDimension
            displayNameProp="displayName"
            selectedDimensions={selected}
            onSelect={(response) => setSelected(response.items)}
            infoBoxMessage={'Test message showing in the info box'}
        />
    )
}

WithInfoBoxMessage.story = {
    name: 'With info box message',
}
