import { SingleSelectField, InputField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import styles from './styles/PeriodFilter.style.js'
import { getFixedPeriodsOptions } from './utils/fixedPeriods.js'
import { filterPeriodTypesById } from './utils/index.js'

const EXCLUDED_PERIOD_TYPES_PROP_DEFAULT = []

const FixedPeriodFilter = ({
    allowedPeriodTypes,
    excludedPeriodTypes = EXCLUDED_PERIOD_TYPES_PROP_DEFAULT,
    currentPeriodType,
    currentYear,
    onSelectPeriodType,
    onSelectYear,
    dataTest,
    availableOptions = null,
    supportsEnabledPeriodTypes = false,
}) => {
    // Determine which period options to show
    let periodOptions
    if (supportsEnabledPeriodTypes && availableOptions) {
        // v43+: Use server-provided enabled period types
        periodOptions = availableOptions
    } else if (allowedPeriodTypes) {
        // Legacy: Filter by allowedPeriodTypes if provided
        periodOptions = getFixedPeriodsOptions().filter((option) =>
            allowedPeriodTypes.some((type) => type === option.id)
        )
    } else {
        // v40-42: Filter by legacy excluded period types (keyHide*Periods system settings)
        periodOptions = filterPeriodTypesById(
            getFixedPeriodsOptions(),
            excludedPeriodTypes
        )
    }

    const onlyAllowedTypeIsSelected =
        periodOptions.length === 1 && periodOptions[0].id === currentPeriodType

    return (
        <>
            <div className="leftSection" data-test={dataTest}>
                <SingleSelectField
                    label={i18n.t('Period type')}
                    onChange={({ selected }) => onSelectPeriodType(selected)}
                    dense
                    selected={currentPeriodType}
                    disabled={onlyAllowedTypeIsSelected}
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
            </div>
            <div className="rightSection">
                <InputField
                    label={i18n.t('Year')}
                    className="filterElement"
                    type="number"
                    placeholder={i18n.t('Select year')}
                    value={currentYear}
                    onChange={({ value }) => onSelectYear(value)}
                    dense
                    dataTest={`${dataTest}-year`}
                ></InputField>
            </div>
            <style jsx>{styles}</style>
        </>
    )
}

FixedPeriodFilter.propTypes = {
    currentPeriodType: PropTypes.string.isRequired,
    currentYear: PropTypes.string.isRequired,
    onSelectPeriodType: PropTypes.func.isRequired,
    onSelectYear: PropTypes.func.isRequired,
    allowedPeriodTypes: PropTypes.arrayOf(PropTypes.string),
    availableOptions: PropTypes.array,
    dataTest: PropTypes.string,
    excludedPeriodTypes: PropTypes.arrayOf(PropTypes.string),
    supportsEnabledPeriodTypes: PropTypes.bool,
}

export default FixedPeriodFilter
