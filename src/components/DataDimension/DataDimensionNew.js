import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { useDataEngine } from '@dhis2/app-runtime'

import ItemSelector from './ItemSelector'
import { fetchDataItems } from '../../api/dimensions'
import { DIMENSION_ID_DATA } from '../../modules/predefinedDimensions'

const DataDimension = ({
    onSelect,
    selectedItems,
    displayNameProp,
    infoBoxMessage,
}) => {
    const dataEngine = useDataEngine()

    const fetchItems = (page, filter, searchTerm) =>
        fetchDataItems({
            dataEngine,
            nameProp: displayNameProp,
            filter,
            searchTerm,
            page,
        })

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
            onFetch={fetchItems}
            onSelect={onSelectItems}
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
