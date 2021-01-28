import React from 'react'
import PropTypes from 'prop-types'

import ItemSelector from './ItemSelector'
import { DIMENSION_ID_DATA } from '../../modules/predefinedDimensions'

const DataDimension = ({
    onSelect,
    selectedItems,
    displayNameProp,
    infoBoxMessage,
}) => {
    const onSelectItems = selectedItem =>
        onSelect({
            dimensionId: DIMENSION_ID_DATA,
            items: selectedItem.map(item => ({
                id: item.value,
                name: item.label,
            })),
        })

    return (
        <ItemSelector
            initialSelected={selectedItems.map(item => ({
                value: item.id,
                label: item.name,
            }))}
            onSelect={onSelectItems}
            displayNameProp={displayNameProp}
            infoBoxMessage={infoBoxMessage}
        />
    )
}

DataDimension.propTypes = {
    displayNameProp: PropTypes.string.isRequired,
    selectedItems: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
        })
    ).isRequired,
    onSelect: PropTypes.func.isRequired,
    infoBoxMessage: PropTypes.string,
}

DataDimension.defaultProps = {
    selectedItems: [],
    onSelect: Function.prototype,
}

export default DataDimension
