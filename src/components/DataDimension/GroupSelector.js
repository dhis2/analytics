import { useDataEngine } from '@dhis2/app-runtime'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { apiFetchGroups } from '../../api/dimensions.js'
import i18n from '../../locales/index.js'
import {
    dataTypeMap as dataTypes,
    SUB_GROUP_DETAIL,
    SUB_GROUP_METRIC,
} from '../../modules/dataTypes.js'
import { DetailSelector } from './DetailSelector.js'
import { MetricSelector } from './MetricSelector.js'
import styles from './styles/GroupSelector.style.js'

const GroupSelector = ({
    dataType,
    currentGroup,
    onGroupChange,
    dataTest,
    displayNameProp,
    currentSubGroup,
    onSubGroupChange,
}) => {
    const dataEngine = useDataEngine()
    const [groups, setGroups] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const defaultGroup = dataTypes[dataType]?.defaultGroup
    const subGroupType = dataTypes[dataType]?.subGroup

    const fetchGroups = async () => {
        setIsLoading(true)
        const result = await apiFetchGroups(
            dataEngine,
            dataType,
            displayNameProp
        )
        setGroups(result)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchGroups()
    }, [dataType])

    return (
        <div className="container">
            <style jsx>{styles}</style>
            <div className="group-container">
                <SingleSelectField
                    label={dataTypes[dataType]?.getGroupLabel()}
                    dataTest={`${dataTest}-groups-select-field`}
                    selected={currentGroup || defaultGroup.id}
                    placeholder={
                        !currentGroup && dataTypes[dataType]?.getPlaceholder
                            ? dataTypes[dataType].getPlaceholder()
                            : null
                    }
                    onChange={(ref) => onGroupChange(ref.selected)}
                    dense
                    empty={
                        dataTypes[dataType]?.getGroupEmptyLabel() ||
                        i18n.t('No data')
                    }
                    loadingText={
                        dataTypes[dataType]?.getGroupLoadingLabel() ||
                        i18n.t('Loading')
                    }
                    loading={isLoading}
                >
                    {dataTypes[dataType]?.defaultGroup ? (
                        <SingleSelectOption
                            value={defaultGroup.id}
                            key={defaultGroup.id}
                            label={defaultGroup.getName()}
                            dataTest={`${dataTest}-groups-select-field-option-${defaultGroup.id}`}
                        />
                    ) : null}
                    {!isLoading
                        ? groups.map((item) => (
                              <SingleSelectOption
                                  value={item.id}
                                  key={item.id}
                                  label={item.name}
                                  dataTest={`${dataTest}-groups-select-field-option-${item.id}`}
                              />
                          ))
                        : null}
                </SingleSelectField>
            </div>
            {subGroupType === SUB_GROUP_DETAIL && (
                <DetailSelector
                    currentValue={currentSubGroup}
                    onChange={onSubGroupChange}
                    dataTest={`${dataTest}-sub-group-select-field`}
                />
            )}
            {subGroupType === SUB_GROUP_METRIC && (
                <MetricSelector
                    currentValue={currentSubGroup}
                    onChange={onSubGroupChange}
                    dataTest={`${dataTest}-sub-group-select-field`}
                />
            )}
        </div>
    )
}

GroupSelector.propTypes = {
    dataType: PropTypes.string.isRequired,
    displayNameProp: PropTypes.string.isRequired,
    onGroupChange: PropTypes.func.isRequired,
    onSubGroupChange: PropTypes.func.isRequired,
    currentGroup: PropTypes.string,
    currentSubGroup: PropTypes.string,
    dataTest: PropTypes.string,
}

export default GroupSelector
