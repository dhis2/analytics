import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { Input } from '@dhis2/ui'

export const NameFilter = ({ value, onChange }) => (
    <Input
        type="search"
        placeholder={i18n.t('Filter by name or ID')}
        onChange={({ value }) => onChange(value)}
        value={value}
        initialFocus={true}
        dense
    />
)

NameFilter.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
}

export default NameFilter
