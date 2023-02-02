import { useConfig } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
import { DIMENSION_ID_DATA } from '../../modules/predefinedDimensions.js'
import ItemSelector from './ItemSelector.js'

const DataDimension = ({
    onSelect,
    selectedDimensions,
    displayNameProp,
    infoBoxMessage,
    onCalculationSave,
}) => {
    const { serverVersion } = useConfig()
    const supportsEDI =
        `${serverVersion.major}.${serverVersion.minor}.${
            serverVersion.patch || 0
        }` >= '2.40.0'

    const onSelectItems = (selectedItem) =>
        onSelect({
            dimensionId: DIMENSION_ID_DATA,
            items: selectedItem.map((item) => ({
                id: item.value,
                name: item.label,
                type: item.type,
                expression: item.expression,
            })),
        })

    return (
        <ItemSelector
            selectedItems={selectedDimensions.map((item) => ({
                value: item.id,
                label: item.name,
                isActive: item.isActive,
                type: item.type,
                expression: item.expression,
            }))}
            onSelect={onSelectItems}
            displayNameProp={displayNameProp}
            infoBoxMessage={infoBoxMessage}
            dataTest={'data-dimension'}
            supportsEDI={supportsEDI}
            onEDISave={onCalculationSave}
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
    onCalculationSave: PropTypes.func,
}

DataDimension.defaultProps = {
    selectedDimensions: [],
    onSelect: Function.prototype,
}

export default DataDimension
