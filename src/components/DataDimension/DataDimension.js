// FIXME: Rename file to DataDimension.js and remove the old data dimension selector and its associated files
import React from 'react'
import PropTypes from 'prop-types'

import ItemSelector from './ItemSelector'
import { DIMENSION_ID_DATA } from '../../modules/predefinedDimensions'

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
