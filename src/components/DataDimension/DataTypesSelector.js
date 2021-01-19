import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'

import { dataTypes } from '../../modules/dataTypes'
import styles from './styles/DataTypesSelector.style'

export const DataTypes = ({ currentDataType, onChange, dataTest }) => (
    <div className="container">
        <SingleSelectField
            label={i18n.t('Data Type')}
            dataTest={dataTest}
            selected={dataTypes[currentDataType]?.id}
            onChange={ref => onChange(ref.selected)}
            dense
        >
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
