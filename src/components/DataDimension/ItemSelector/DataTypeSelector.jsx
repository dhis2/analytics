import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../locales/index.js'
import { DIMENSION_TYPE_ALL, dataTypeMap } from '../../../modules/dataTypes.js'
import { getDisplayNameByVisType } from '../../../modules/visTypes.js'
import { useDataDimensionContext } from '../DataDimension.jsx'
import styles from './styles/DataTypeSelector.style.js'

const DataTypeSelector = ({
    currentDataType,
    dataTypes,
    onChange,
    dataTest,
}) => {
    const { visType } = useDataDimensionContext()
    const label = i18n.t('Data Type')

    return (
        <div className="container">
            {dataTypes.length === 1 ? (
                <SingleSelectField
                    label={label}
                    dataTest={dataTest}
                    selected={dataTypes[0].id}
                    onChange={(ref) => onChange(ref.selected)}
                    dense
                    disabled={true}
                    helpText={
                        visType
                            ? i18n.t(
                                  'Only {{dataType}} can be used in {{visType}}',
                                  {
                                      dataType:
                                          dataTypeMap[
                                              dataTypes[0].id
                                          ].getName(),
                                      visType: getDisplayNameByVisType(visType),
                                  }
                              )
                            : ''
                    }
                >
                    {dataTypes.map((type) => (
                        <SingleSelectOption
                            value={type.id}
                            key={type.id}
                            label={type.getName()}
                            dataTest={`${dataTest}-option-${type.id}`}
                        />
                    ))}
                </SingleSelectField>
            ) : (
                <SingleSelectField
                    label={label}
                    dataTest={dataTest}
                    selected={currentDataType || DIMENSION_TYPE_ALL}
                    onChange={(ref) => onChange(ref.selected)}
                    dense
                >
                    <SingleSelectOption
                        value={DIMENSION_TYPE_ALL}
                        key={DIMENSION_TYPE_ALL}
                        label={i18n.t('All types')}
                        dataTest={`${dataTest}-option-all`}
                    />
                    {dataTypes.map((type) => (
                        <SingleSelectOption
                            value={type.id}
                            key={type.id}
                            label={type.getName()}
                            dataTest={`${dataTest}-option-${type.id}`}
                        />
                    ))}
                </SingleSelectField>
            )}
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
