import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'

import { dataTypes } from '../../modules/dataTypes'
import styles from './styles/DataTypesSelector.style'

export const DataTypes = ({ currentDataType, onChange }) => (
    <div className="container">
        <SingleSelectField
            label={i18n.t('Data Type')}
            selected={dataTypes[currentDataType]?.id}
            onChange={ref => onChange(ref.selected)}
            dense
        >
            {Object.values(dataTypes).map(type => (
                <SingleSelectOption
                    value={type.id}
                    key={type.id}
                    label={type.getName()}
                />
            ))}
        </SingleSelectField>
        <style jsx>{styles}</style>
    </div>
)

DataTypes.propTypes = {
    currentDataType: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default DataTypes
