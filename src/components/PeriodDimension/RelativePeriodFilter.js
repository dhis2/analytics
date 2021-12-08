import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import styles from './styles/PeriodFilter.style'
import { filterPeriodTypesById } from './utils/index.js'
import { getRelativePeriodsOptions } from './utils/relativePeriods'

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
            {filterPeriodTypesById(
                getRelativePeriodsOptions(),
                excludedPeriodTypes
            ).map((option) => (
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
