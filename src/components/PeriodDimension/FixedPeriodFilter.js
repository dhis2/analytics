import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, InputField, SingleSelectOption } from '@dhis2/ui'

import { getFixedPeriodsOptions } from './utils/fixedPeriods'
import styles from './styles/PeriodFilter.style'

const FixedPeriodFilter = ({
    allowedPeriodTypes,
    currentPeriodType,
    currentYear,
    onSelectPeriodType,
    onSelectYear,
}) => {
    const onlyAllowedTypeIsSelected =
        Array.isArray(allowedPeriodTypes) &&
        allowedPeriodTypes.length === 1 &&
        allowedPeriodTypes[0] === currentPeriodType

    return (
        <>
            <div className="leftSection">
                <SingleSelectField
                    label={i18n.t('Period type')}
                    onChange={({ selected }) => onSelectPeriodType(selected)}
                    dense
                    selected={currentPeriodType}
                    disabled={onlyAllowedTypeIsSelected}
                    className="filterElement"
                >
                    {getFixedPeriodsOptions()
                        .filter(
                            option =>
                                !allowedPeriodTypes ||
                                allowedPeriodTypes.some(
                                    type => type === option.id
                                )
                        )
                        .map(option => (
                            <SingleSelectOption
                                key={option.id}
                                value={option.id}
                                label={option.name}
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
}

export default FixedPeriodFilter
