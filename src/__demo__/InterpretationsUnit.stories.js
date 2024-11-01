import { CustomDataProvider } from '@dhis2/app-runtime'
import { storiesOf } from '@storybook/react'
import React from 'react'
import { InterpretationsUnit } from '../components/Interpretations/InterpretationsUnit/index.js'

storiesOf('IntepretationsUnit', module).add('Default', () => {
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
})

storiesOf('IntepretationsUnit', module).add(
    'With no time dimensions warning',
    () => {
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
)
