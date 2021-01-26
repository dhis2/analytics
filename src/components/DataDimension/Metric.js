import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import { ALL_ID } from '../../modules/dataTypes'

import styles from './styles/Metric.style'
import { DATA_SETS_CONSTANTS } from '../../modules/dataSets'

export const Metric = ({ currentValue, onChange }) => {
    return (
        <div className="metric-container">
            <SingleSelectField
                label={i18n.t('Metric type')}
                selected={currentValue || ALL_ID}
                onChange={ref => onChange(ref.selected)}
                dense
            >
                <SingleSelectOption
                    value={ALL_ID}
                    key={ALL_ID}
                    label={i18n.t('All metrics')}
                />
                {DATA_SETS_CONSTANTS.map(option => (
                    <SingleSelectOption
                        value={option.id}
                        key={option.id}
                        label={option.getName()}
                    />
                ))}
            </SingleSelectField>
            <style jsx>{styles}</style>
        </div>
    )
}

Metric.propTypes = {
    currentValue: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default Metric
