import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

// TODO change the "Created by" prefix to "Creator" or something that does not require a context for the translators

export const OwnerFilter = ({ selected, onChange }) => (
    <SingleSelect
        selected={selected}
        onChange={({ selected }) => onChange(selected)}
        prefix={i18n.t('Created by')}
        dense
    >
        <SingleSelectOption label={i18n.t('Anyone')} value="all" />
        <SingleSelectOption label={i18n.t('Only you')} value="byme" />
        <SingleSelectOption label={i18n.t('Others')} value="byothers" />
    </SingleSelect>
)

OwnerFilter.propTypes = {
    selected: PropTypes.string,
    onChange: PropTypes.func,
}

export default OwnerFilter
