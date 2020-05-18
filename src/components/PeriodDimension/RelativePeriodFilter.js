import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectOption, SingleSelectField } from '@dhis2/ui-core'

import { getRelativePeriodsOptions } from './utils/RelativePeriodsGenerator'

export const defaultState = {
    periodType: 'Months',
}

const RelativePeriodsFilter = ({ currentTypeFilter, selectTypeFilter }) => (
    <SingleSelectField
        label={i18n.t('Period type')}
        onChange={({ selected }) => selectTypeFilter(selected)}
        dense
        selected={currentTypeFilter}
    >
        {getRelativePeriodsOptions().map(option => (
            <SingleSelectOption
                key={option.id}
                value={option.id}
                label={option.getName()}
            />
        ))}
    </SingleSelectField>
)

RelativePeriodsFilter.propTypes = {
    currentTypeFilter: PropTypes.object.isRequired,
    selectTypeFilter: PropTypes.func.isRequired,
}

export default RelativePeriodsFilter
