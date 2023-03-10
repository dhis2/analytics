import { Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'

export const NameFilter = ({ dataTest, value, onChange }) => (
    <Input
        type="search"
        placeholder={i18n.t('Filter by name')}
        onChange={({ value }) => onChange(value)}
        value={value}
        initialFocus={true}
        dense
        dataTest={dataTest}
    />
)

NameFilter.propTypes = {
    onChange: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
    value: PropTypes.string,
}

export default NameFilter
