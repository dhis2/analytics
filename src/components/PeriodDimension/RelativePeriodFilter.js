import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import styles from './styles/PeriodFilter.style.js'
import { filterPeriodTypesById } from './utils/index.js'
import { getRelativePeriodsOptions } from './utils/relativePeriods.js'

const RelativePeriodFilter = ({
    currentFilter,
    onSelectFilter,
    dataTest,
    excludedPeriodTypes,
    availableOptions = null,
    supportsEnabledPeriodTypes = false,
}) => {
    // v43+: Use server-provided enabled options, v40-42: Use legacy excluded period types
    const periodOptions =
        supportsEnabledPeriodTypes && availableOptions
            ? availableOptions // Server-provided enabled period types
            : filterPeriodTypesById(
                  getRelativePeriodsOptions(),
                  excludedPeriodTypes // Legacy keyHide*Periods system settings
              )

    return (
        <div className="leftSection" data-test={dataTest}>
            <SingleSelectField
                label={i18n.t('Period type')}
                onChange={({ selected }) => onSelectFilter(selected)}
                dense
                selected={currentFilter}
                className="filterElement"
                dataTest={`${dataTest}-period-type`}
            >
                {periodOptions.map((option) => (
                    <SingleSelectOption
                        key={option.id}
                        value={option.id}
                        label={option.name}
                        dataTest={`${dataTest}-period-type-option-${option.id}`}
                    />
                ))}
            </SingleSelectField>
            <style jsx>{styles}</style>
        </div>
    )
}

RelativePeriodFilter.propTypes = {
    currentFilter: PropTypes.string.isRequired,
    onSelectFilter: PropTypes.func.isRequired,
    availableOptions: PropTypes.array,
    dataTest: PropTypes.string,
    excludedPeriodTypes: PropTypes.arrayOf(PropTypes.string),
    supportsEnabledPeriodTypes: PropTypes.bool,
}

export default RelativePeriodFilter
