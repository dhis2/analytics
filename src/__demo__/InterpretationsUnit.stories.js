import { CustomDataProvider } from '@dhis2/app-runtime'
import React from 'react'
import { InterpretationsProvider } from '../components/Interpretations/InterpretationsProvider/InterpretationsProvider.js'
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
            <InterpretationsProvider
                currentUser={{
                    name: 'Tom Wakiki',
                }}
            >
                <InterpretationsUnit
                    id="abcd"
                    onReplyIconClick={Function.prototype}
                    type="eventVisualization"
                    visualizationHasTimeDimension={true}
                />
            </InterpretationsProvider>
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
            <InterpretationsProvider
                currentUser={{
                    name: 'Tom Wakiki',
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
            </InterpretationsProvider>
        </CustomDataProvider>
    )
}

WithNoTimeDimensionsWarning.story = {
    name: 'With no time dimensions warning',
}
