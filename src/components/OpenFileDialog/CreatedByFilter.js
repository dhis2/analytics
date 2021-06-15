import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

// TODO change the "Created by" prefix to "Creator" or something that does not require a context for the translators

export const CREATED_BY_ALL = 'all'
export const CREATED_BY_ALL_BUT_CURRENT_USER = 'allButCurrentUser'
export const CREATED_BY_CURRENT_USER = 'currentUser'

export const CreatedByFilter = ({ selected, onChange }) => (
    <SingleSelect
        selected={selected}
        onChange={({ selected }) => onChange(selected)}
        prefix={i18n.t('Created by')}
        dense
    >
        <SingleSelectOption label={i18n.t('Anyone')} value={CREATED_BY_ALL} />
        <SingleSelectOption
            label={i18n.t('Only you')}
            value={CREATED_BY_CURRENT_USER}
        />
        <SingleSelectOption
            label={i18n.t('Others')}
            value={CREATED_BY_ALL_BUT_CURRENT_USER}
        />
    </SingleSelect>
)

CreatedByFilter.propTypes = {
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.string,
}

export default CreatedByFilter
