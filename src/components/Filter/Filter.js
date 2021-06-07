import React from 'react'
import PropTypes from 'prop-types'
import { InputField } from '@dhis2/ui'

import styles from './styles/Filter.style'

export const Filter = ({
    text,
    onChange,
    onClear,
    placeholder,
    type,
    dataTest,
}) => (
    <div className="container">
        <InputField
            placeholder={placeholder}
            onChange={ref =>
                ref.value.length ? onChange(ref.value) : onClear()
            }
            value={text}
            dense
            type={type}
            dataTest={dataTest}
        />
        <style jsx>{styles}</style>
    </div>
)

Filter.propTypes = {
    placeholder: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
    text: PropTypes.string,
}

Filter.defaultProps = {
    type: 'text',
}

export default Filter
