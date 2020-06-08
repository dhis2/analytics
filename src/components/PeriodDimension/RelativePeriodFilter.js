import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'

import { getRelativePeriodsOptions } from './utils/relativePeriods'
import styles from './styles/PeriodFilter.style'

const RelativePeriodFilter = ({ currentFilter, onSelectFilter }) => (
    <div className="leftSection">
        <SingleSelectField
            label={i18n.t('Period type')}
            onChange={({ selected }) => onSelectFilter(selected)}
            dense
            selected={currentFilter}
            className="filterElement"
        >
            {getRelativePeriodsOptions().map(option => (
                <SingleSelectOption
                    key={option.id}
                    value={option.id}
                    label={option.name}
                />
            ))}
        </SingleSelectField>
        <style jsx>{styles}</style>
    </div>
)

RelativePeriodFilter.propTypes = {
    currentFilter: PropTypes.string.isRequired,
    onSelectFilter: PropTypes.func.isRequired,
}

export default RelativePeriodFilter
