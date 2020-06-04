import React from 'react'
import PropTypes from 'prop-types'
import { InputField } from '@dhis2/ui'

export const Filter = ({ text, onChange, onClear, placeholder, type }) => (
    <InputField
        placeholder={placeholder}
        onChange={ref => (ref.value.length ? onChange(ref.value) : onClear())}
        value={text}
        dense
        type={type}
    />
)

Filter.propTypes = {
    placeholder: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    text: PropTypes.string,
}

Filter.defaultProps = {
    type: 'text',
}

export default Filter
