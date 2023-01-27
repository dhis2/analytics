import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import {
    DIMENSION_TYPE_ALL,
    dataTypeMap as dataTypes,
    DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM,
} from '../../modules/dataTypes.js'
import styles from './styles/DataTypeSelector.style.js'

const DataTypeSelector = ({
    currentDataType,
    onChange,
    dataTest,
    includeCalculations,
}) => (
    <div className="container">
        <SingleSelectField
            label={i18n.t('Data Type')}
            dataTest={dataTest}
            selected={dataTypes[currentDataType]?.id || DIMENSION_TYPE_ALL}
            onChange={(ref) => onChange(ref.selected)}
            dense
        >
            <SingleSelectOption
                value={DIMENSION_TYPE_ALL}
                key={DIMENSION_TYPE_ALL}
                label={i18n.t('All types')}
                dataTest={`${dataTest}-option-all`}
            />
            {Object.values(dataTypes)
                .filter(
                    (type) =>
                        type.id !== DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM ||
                        includeCalculations
                )
                .map((type) => (
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

DataTypeSelector.propTypes = {
    currentDataType: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
    includeCalculations: PropTypes.bool,
}

export default DataTypeSelector
