import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import { useDataEngine } from '@dhis2/app-runtime'

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
    detailValue,
    currentGroup,
    onDetailChange,
    onGroupChange,
    dataTest,
    displayNameProp,
    metricValue,
    onMetricChange,
}) => {
    const dataEngine = useDataEngine()
    const [groups, setGroups] = useState([])
    const defaultGroup = dataTypes[dataType]?.defaultGroup
    const subGroup = dataTypes[dataType]?.subGroup

    const fetchGroups = async () => {
        const result = await apiFetchGroups(
            dataEngine,
            dataType,
            displayNameProp
        )
        setGroups(result)
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
                >
                    {dataTypes[dataType]?.defaultGroup ? (
                        <SingleSelectOption
                            value={defaultGroup.id}
                            key={defaultGroup.id}
                            label={defaultGroup.getName()}
                            dataTest={`${dataTest}-option-${defaultGroup.id}`}
                        />
                    ) : null}
                    {groups.map(item => (
                        <SingleSelectOption
                            value={item.id}
                            key={item.id}
                            label={item.name}
                            dataTest={`${dataTest}-option-${item.id}`}
                        />
                    ))}
                </SingleSelectField>
            </div>
            {subGroup === SUB_GROUP_DETAIL && (
                <Detail currentValue={detailValue} onChange={onDetailChange} />
            )}
            {subGroup === SUB_GROUP_METRIC && (
                <Metric currentValue={metricValue} onChange={onMetricChange} />
            )}
        </div>
    )
}

Groups.propTypes = {
    dataType: PropTypes.string.isRequired,
    detailValue: PropTypes.string.isRequired,
    displayNameProp: PropTypes.string.isRequired,
    onDetailChange: PropTypes.func.isRequired,
    onGroupChange: PropTypes.func.isRequired,
    currentGroup: PropTypes.string,
    dataTest: PropTypes.string,
}

export default Groups
