import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectOption, SingleSelectField } from '@dhis2/ui-core'

import { getRelativePeriodsOptions } from './utils/RelativePeriodsGenerator'

const RelativePeriodFilter = ({ currentFilter, selectFilter }) => (
    <SingleSelectField
        label={i18n.t('Period type')}
        onChange={({ selected }) => selectFilter(selected)}
        dense
        selected={currentFilter}
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

RelativePeriodFilter.propTypes = {
    currentFilter: PropTypes.object.isRequired,
    selectFilter: PropTypes.func.isRequired,
}

export default RelativePeriodFilter
