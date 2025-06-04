import { CustomDataProvider } from '@dhis2/app-runtime'
import React from 'react'
import { InterpretationsUnit } from '../components/Interpretations/InterpretationsUnit/index.js'

export default {
    title: 'IntepretationsUnit',
}

export const Default = () => {
    return (
        <CustomDataProvider
            data={{
                interpretations: {
                    interpretations: [],
                },
            }}
        >
            <InterpretationsUnit
                currentUser={{
                    name: 'Tom Wakiki',
                }}
                id="abcd"
                onReplyIconClick={Function.prototype}
                type="eventVisualization"
                visualizationHasTimeDimension={true}
            />
        </CustomDataProvider>
    )
}

export const WithNoTimeDimensionsWarning = () => {
    return (
        <CustomDataProvider
            data={{
                interpretations: {
                    interpretations: [],
                },
            }}
        >
            <InterpretationsUnit
                currentUser={{
                    name: 'Tom Wakiki',
                }}
                id="abcd"
                onReplyIconClick={Function.prototype}
                type="eventVisualization"
                visualizationHasTimeDimension={false}
            />
        </CustomDataProvider>
    )
}

WithNoTimeDimensionsWarning.story = {
    name: 'With no time dimensions warning',
}
