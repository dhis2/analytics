import React from 'react'
import PropTypes from 'prop-types'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'

import { Detail } from './Detail'
import { dataTypes } from '../../modules/dataTypes'
import { styles } from './styles/Groups.style'

const Groups = props => {
    const handleChange = event => {
        props.onGroupChange(event.target.value)
    }

    const renderDropDownItems = () => {
        let optionItems = props.groups

        if (dataTypes[props.dataType].defaultGroup) {
            const { id, name } = dataTypes[props.dataType].defaultGroup
            const defaultGroup = { id, name: name() }
            optionItems = [defaultGroup, ...optionItems]
        }

        return optionItems.map(item => (
            <MenuItem key={item.id} value={item.id}>
                {item.name}
            </MenuItem>
        ))
    }

    const groupDetail = dataTypes[props.dataType].groupDetail

    const havePlaceholder = Boolean(
        !props.groupId && dataTypes[props.dataType].placeholder
    )

    return (
        <div style={styles.container}>
            <div style={styles.groupContainer}>
                <InputLabel style={styles.titleText}>
                    {dataTypes[props.dataType].groupLabel()}
                </InputLabel>
                <Select
                    value={props.groupId}
                    onChange={handleChange}
                    renderValue={
                        havePlaceholder
                            ? dataTypes[props.dataType].placeholder
                            : null
                    }
                    displayEmpty={havePlaceholder}
                    disableUnderline
                    SelectDisplayProps={
                        havePlaceholder
                            ? { style: styles.placeholder }
                            : { style: styles.dropDown }
                    }
                >
                    {renderDropDownItems()}
                </Select>
            </div>
            {groupDetail && (
                <Detail
                    value={props.detailValue}
                    onChange={props.onDetailChange}
                />
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
