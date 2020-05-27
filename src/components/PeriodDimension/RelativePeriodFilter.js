import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectOption, SingleSelectField } from '@dhis2/ui-core'

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
                    label={option.getName()}
                />
            ))}
        </SingleSelectField>
        <style jsx>{styles}</style>
    </div>
)

RelativePeriodFilter.propTypes = {
    currentFilter: PropTypes.object.isRequired,
    onSelectFilter: PropTypes.func.isRequired,
}

export default RelativePeriodFilter
