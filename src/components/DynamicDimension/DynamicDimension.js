import React from 'react'
import PropTypes from 'prop-types'
import i18n from '../../locales/index.js'
import { useDataEngine } from '@dhis2/app-runtime'

import ItemSelector from './ItemSelector'
import { apiFetchItemsByDimension } from '../../api/dimensions'

export const DynamicDimension = ({
    dimensionId,
    onSelect,
    selectedItems,
    rightFooter,
    dimensionTitle,
    displayNameProp,
}) => {
    const dataEngine = useDataEngine()

    const fetchItems = (page, searchTerm) =>
        apiFetchItemsByDimension({
            dataEngine,
            dimensionId,
            searchTerm,
            page,
            nameProp: displayNameProp,
        })

    const onSelectItems = selectedItem =>
        onSelect({
            dimensionId: dimensionId,
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
            noItemsMessage={i18n.t('Nothing found in {{dimensionTitle}}', {
                dimensionTitle,
            })}
            onFetch={fetchItems}
            onSelect={onSelectItems}
            rightFooter={rightFooter}
            dataTest={`${dimensionTitle
                .replace(/\s+/g, '-')
                .toLowerCase()}-dimension`}
        />
    )
}

DynamicDimension.propTypes = {
    dimensionId: PropTypes.string.isRequired,
    dimensionTitle: PropTypes.string.isRequired,
    displayNameProp: PropTypes.string.isRequired,
    selectedItems: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
        })
    ).isRequired,
    onSelect: PropTypes.func.isRequired,
    rightFooter: PropTypes.node,
}

DynamicDimension.defaultProps = {
    selectedItems: [],
    onSelect: Function.prototype,
}

export default DynamicDimension
