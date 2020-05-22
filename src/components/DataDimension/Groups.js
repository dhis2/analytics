import React from 'react'
import PropTypes from 'prop-types'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui-core'

import { Detail } from './Detail'
import { dataTypes } from '../../modules/dataTypes'
import styles from './styles/Groups.style'

export const Groups = ({
    dataType,
    detailValue,
    groupId,
    groups,
    onDetailChange,
    onGroupChange,
}) => {
    let optionItems = groups

    if (dataTypes[dataType].defaultGroup) {
        const { id, name } = dataTypes[dataType].defaultGroup
        const defaultGroup = { id, name: name() }
        optionItems = [defaultGroup, ...optionItems]
    }

    const groupDetail = dataTypes[dataType].groupDetail

    const selected = optionItems.find(item => item.id === groupId) || {}

    return (
        <div className="container">
            <style jsx>{styles}</style>
            <div className="group-container">
                <SingleSelectField
                    label={dataTypes[dataType].getGroupLabel()}
                    selected={
                        selected.id && selected.name
                            ? { value: selected.id, label: selected.name }
                            : {}
                    }
                    placeholder={
                        !groupId && dataTypes[dataType].placeholder
                            ? dataTypes[dataType].placeholder
                            : null
                    }
                    onChange={ref => onGroupChange(ref.selected.value)}
                    dense
                >
                    {optionItems.map(item => (
                        <SingleSelectOption
                            value={item.id}
                            key={item.id}
                            label={item.name}
                        />
                    ))}
                </SingleSelectField>
            </div>
            {groupDetail && (
                <Detail currentValue={detailValue} onChange={onDetailChange} />
            )}
        </div>
    )
}

Groups.propTypes = {
    dataType: PropTypes.string.isRequired,
    detailValue: PropTypes.string.isRequired,
    groupId: PropTypes.string.isRequired,
    groups: PropTypes.array.isRequired,
    onDetailChange: PropTypes.func.isRequired,
    onGroupChange: PropTypes.func.isRequired,
}

export default Groups
