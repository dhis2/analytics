import { InputField } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/Filter.style.js'

const Filter = ({
    text,
    onChange,
    onClear,
    placeholder,
    type = 'text',
    dataTest,
}) => (
    <div className="container">
        <InputField
            placeholder={placeholder}
            onChange={(ref) =>
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
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
    text: PropTypes.string,
    type: PropTypes.string,
}

export default Filter
