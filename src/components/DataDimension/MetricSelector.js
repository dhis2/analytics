import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import { DATA_SETS_CONSTANTS } from '../../modules/dataSets.js'
import { ALL_ID } from '../../modules/dataTypes.js'
import styles from './styles/MetricSelector.style.js'

export const MetricSelector = ({ currentValue, onChange, dataTest }) => {
    return (
        <div className="metric-container">
            <SingleSelectField
                label={i18n.t('Metric type')}
                selected={currentValue || ALL_ID}
                onChange={ref => onChange(ref.selected)}
                dense
                dataTest={dataTest}
            >
                <SingleSelectOption
                    value={ALL_ID}
                    key={ALL_ID}
                    label={i18n.t('All metrics')}
                    dataTest={`${dataTest}-option-${ALL_ID}`}
                />
                {DATA_SETS_CONSTANTS.map(option => (
                    <SingleSelectOption
                        value={option.id}
                        key={option.id}
                        label={option.getName()}
                        dataTest={`${dataTest}-option-${option.id}`}
                    />
                ))}
            </SingleSelectField>
            <style jsx>{styles}</style>
        </div>
    )
}

MetricSelector.propTypes = {
    onChange: PropTypes.func.isRequired,
    currentValue: PropTypes.string,
    dataTest: PropTypes.string,
}

export default MetricSelector
