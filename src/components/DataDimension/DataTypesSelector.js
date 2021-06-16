import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import { ALL_ID, dataTypes } from '../../modules/dataTypes'
import styles from './styles/DataTypesSelector.style'

const DataTypes = ({ currentDataType, onChange, dataTest }) => (
    <div className="container">
        <SingleSelectField
            label={i18n.t('Data Type')}
            dataTest={dataTest}
            selected={dataTypes[currentDataType]?.id || ALL_ID}
            onChange={ref => onChange(ref.selected)}
            dense
        >
            <SingleSelectOption
                value={ALL_ID}
                key={ALL_ID}
                label={i18n.t('All types')}
                dataTest={`${dataTest}-option-all`}
            />
            {Object.values(dataTypes).map(type => (
                <SingleSelectOption
                    value={type.id}
                    key={type.id}
                    label={type.getName()}
                    dataTest={`${dataTest}-option-${type.id}`}
                />
            ))}
        </SingleSelectField>
        <style jsx>{styles}</style>
    </div>
)

DataTypes.propTypes = {
    currentDataType: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
}

export default DataTypes
