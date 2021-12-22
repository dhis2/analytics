import PropTypes from 'prop-types'
import React from 'react'
import { DIMENSION_ID_DATA } from '../../modules/predefinedDimensions.js'
import ItemSelector from './ItemSelector.js'

const DataDimension = ({
    onSelect,
    selectedDimensions,
    displayNameProp,
    infoBoxMessage,
}) => {
    const onSelectItems = selectedItem =>
        onSelect({
            dimensionId: DIMENSION_ID_DATA,
            items: selectedItem.map(item => ({
                id: item.value,
                name: item.label,
                type: item.type,
            })),
        })

    return (
        <ItemSelector
            selectedItems={selectedDimensions.map(item => ({
                value: item.id,
                label: item.name,
                isActive: item.isActive,
                type: item.type,
            }))}
            onSelect={onSelectItems}
            displayNameProp={displayNameProp}
            infoBoxMessage={infoBoxMessage}
            dataTest={'data-dimension'}
        />
    )
}

DataDimension.propTypes = {
    displayNameProp: PropTypes.string.isRequired,
    selectedDimensions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
        })
    ).isRequired,
    onSelect: PropTypes.func.isRequired,
    infoBoxMessage: PropTypes.string,
}

DataDimension.defaultProps = {
    selectedDimensions: [],
    onSelect: Function.prototype,
}

export default DataDimension
