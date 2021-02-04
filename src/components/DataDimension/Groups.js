import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'

import { Detail } from './Detail'
import {
    dataTypes,
    SUB_GROUP_DETAIL,
    SUB_GROUP_METRIC,
} from '../../modules/dataTypes'
import styles from './styles/Groups.style'
import { apiFetchGroups } from '../../api/dimensions'
import { Metric } from './Metric'

const Groups = ({
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
                    dataTest={dataTest}
                    selected={currentGroup || defaultGroup.id}
                    placeholder={
                        !currentGroup && dataTypes[dataType]?.getPlaceholder
                            ? dataTypes[dataType].getPlaceholder()
                            : null
                    }
                    onChange={ref => onGroupChange(ref.selected)}
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
                            dataTest={`${dataTest}-option-${defaultGroup.id}`}
                        />
                    ) : null}
                    {!isLoading
                        ? groups.map(item => (
                              <SingleSelectOption
                                  value={item.id}
                                  key={item.id}
                                  label={item.name}
                                  dataTest={`${dataTest}-option-${item.id}`}
                              />
                          ))
                        : null}
                </SingleSelectField>
            </div>
            {subGroupType === SUB_GROUP_DETAIL && (
                <Detail
                    currentValue={currentSubGroup}
                    onChange={onSubGroupChange}
                />
            )}
            {subGroupType === SUB_GROUP_METRIC && (
                <Metric
                    currentValue={currentSubGroup}
                    onChange={onSubGroupChange}
                />
            )}
        </div>
    )
}

Groups.propTypes = {
    dataType: PropTypes.string.isRequired,
    displayNameProp: PropTypes.string.isRequired,
    onGroupChange: PropTypes.func.isRequired,
    onSubGroupChange: PropTypes.func.isRequired,
    currentGroup: PropTypes.string,
    currentSubGroup: PropTypes.string,
    dataTest: PropTypes.string,
}

export default Groups
