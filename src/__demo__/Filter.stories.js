import React, { useState } from 'react'
import Filter from '../components/Filter/Filter.js'

function FilterWithState() {
    const [text, setText] = useState(null)

    const onTextChange = (value) => setText(value)
    const onClearFilter = () => setText(null)
    return (
        <Filter
            placeholder="Filter dimensions"
            text={text}
            onChange={onTextChange}
            onClear={onClearFilter}
            disableUnderline={true}
            type="search"
        />
    )
}

export default {
    title: 'Filter',
}

export const Default = () => {
    return <FilterWithState />
}

Default.story = {
    name: 'default',
}
