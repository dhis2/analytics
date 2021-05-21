import React from 'react'
import PropTypes from 'prop-types'
import i18n from '../../locales/index.js'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'

import { getRelativePeriodsOptions } from './utils/relativePeriods'
import styles from './styles/PeriodFilter.style'

const RelativePeriodFilter = ({
    currentFilter,
    onSelectFilter,
    dataTest,
    excludedPeriodTypes,
}) => (
    <div className="leftSection">
        <SingleSelectField
            label={i18n.t('Period type')}
            onChange={({ selected }) => onSelectFilter(selected)}
            dense
            selected={currentFilter}
            className="filterElement"
            dataTest={dataTest}
        >
            {getRelativePeriodsOptions()
                .filter(period => !excludedPeriodTypes.includes(period.id))
                .map(option => (
                    <SingleSelectOption
                        key={option.id}
                        value={option.id}
                        label={option.name}
                        dataTest={`${dataTest}-option-${option.id}`}
                    />
                ))}
        </SingleSelectField>
        <style jsx>{styles}</style>
    </div>
)

RelativePeriodFilter.propTypes = {
    currentFilter: PropTypes.string.isRequired,
    onSelectFilter: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
    excludedPeriodTypes: PropTypes.arrayOf(PropTypes.string),
}

export default RelativePeriodFilter
