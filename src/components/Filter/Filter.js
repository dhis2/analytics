import React from 'react'
import PropTypes from 'prop-types'
import { InputField } from '@dhis2/ui-core'

export const Filter = ({ text, onChange, onClear, placeholder }) => (
    <InputField
        placeholder={placeholder}
        onChange={ref => (ref.value.length ? onChange(ref.value) : onClear())}
        value={text}
        dense
    />
)

Filter.propTypes = {
    placeholder: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
}

export default Filter
