import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import styles from './styles/PeriodFilter.style.js'

const RelativePeriodFilter = ({
    currentFilter,
    onSelectFilter,
    dataTest,
    availableOptions,
}) => (
    <div className="leftSection" data-test={dataTest}>
        <SingleSelectField
            label={i18n.t('Period type')}
            onChange={({ selected }) => onSelectFilter(selected)}
            dense
            selected={currentFilter}
            className="filterElement"
            dataTest={`${dataTest}-period-type`}
        >
            {availableOptions.map((option) => (
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

RelativePeriodFilter.propTypes = {
    availableOptions: PropTypes.array.isRequired,
    currentFilter: PropTypes.string.isRequired,
    onSelectFilter: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
}

export default RelativePeriodFilter
