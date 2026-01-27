import { SingleSelectField, InputField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import styles from './styles/PeriodFilter.style.js'

const FixedPeriodFilter = ({
    availableOptions,
    currentPeriodType,
    currentYear,
    onSelectPeriodType,
    onSelectYear,
    dataTest,
}) => {
    const onlyAllowedTypeIsSelected =
        availableOptions.length === 1 &&
        availableOptions[0].id === currentPeriodType

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
                    {availableOptions.map((option) => (
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
    availableOptions: PropTypes.array.isRequired,
    currentPeriodType: PropTypes.string.isRequired,
    currentYear: PropTypes.string.isRequired,
    onSelectPeriodType: PropTypes.func.isRequired,
    onSelectYear: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
}

export default FixedPeriodFilter
