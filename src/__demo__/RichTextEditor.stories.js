import { CustomDataProvider } from '@dhis2/app-runtime'
import { storiesOf } from '@storybook/react'
import React, { useState } from 'react'
import { RichTextEditor } from '../components/Interpretations/common/index.js'

storiesOf('RichTextEditor', module).add('Default', () => {
    const [value, setValue] = useState('')

    return (
        <CustomDataProvider>
            <RichTextEditor value={value} onChange={setValue} />
        </CustomDataProvider>
    )
})

storiesOf('RichTextEditor', module).add('Long warning text', () => {
    const [value, setValue] = useState('')

    return (
        <CustomDataProvider>
            <RichTextEditor
                value={value}
                onChange={setValue}
                warningText="Unable to create a snapshot of this visualization, because it contains no time dimension. Beware that others viewing this interpretation in the future may see more data than currently available."
            />
        </CustomDataProvider>
    )
})
