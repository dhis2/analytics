import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import { DIMENSION_TYPE_ALL, dataTypeMap } from '../../modules/dataTypes.js'
import { getDisplayNameByVisType } from '../../modules/visTypes.js'
import { useDataDimensionContext } from './DataDimension.js'
import styles from './styles/DataTypeSelector.style.js'

const DataTypeSelector = ({
    currentDataType,
    dataTypes,
    onChange,
    dataTest,
}) => {
    const { visType } = useDataDimensionContext()

    return (
        <div className="container">
            <SingleSelectField
                label={i18n.t('Data Type')}
                dataTest={dataTest}
                selected={
                    currentDataType ||
                    (dataTypes.length === 1
                        ? dataTypes[0].id
                        : DIMENSION_TYPE_ALL)
                }
                onChange={(ref) => onChange(ref.selected)}
                dense
                disabled={dataTypes.length === 1}
                helpText={
                    dataTypes.length === 1 && visType
                        ? i18n.t(
                              'Only {{dataType}} can be used in {{visType}}',
                              {
                                  dataType:
                                      dataTypeMap[dataTypes[0].id].getName(),
                                  visType: getDisplayNameByVisType(visType),
                              }
                          )
                        : ''
                }
            >
                {dataTypes.length > 1 && (
                    <SingleSelectOption
                        value={DIMENSION_TYPE_ALL}
                        key={DIMENSION_TYPE_ALL}
                        label={i18n.t('All types')}
                        dataTest={`${dataTest}-option-all`}
                    />
                )}
                {dataTypes.map((type) => (
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
}

DataTypeSelector.propTypes = {
    currentDataType: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
    dataTypes: PropTypes.array,
}

export default DataTypeSelector
