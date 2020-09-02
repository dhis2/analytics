import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { useDataEngine } from '@dhis2/app-runtime'

import ItemSelector from './ItemSelector'
import { apiFetchItemsByDimension } from '../../api/dimensions'

export const DynamicDimension = ({
    dimensionId,
    onSelect,
    selectedItems,
    rightFooter,
    dimensionTitle,
}) => {
    const engine = useDataEngine()

    const fetchItemsEndpoint = (pageSize, page, searchTerm) => {
        console.log(
            'PAGESIZE: ' +
                pageSize +
                ' PAGE: ' +
                page +
                ' SEARCHTERM: ' +
                searchTerm
        )
        return apiFetchItemsByDimension({
            engine,
            dimensionId,
            searchTerm,
            pageSize,
            page,
        })
    }

    const onSelectItems = selectedItem =>
        onSelect({
            dimensionId: dimensionId,
            items: selectedItem.map(item => ({
                id: item.value,
                name: item.label,
            })),
        })

    return (
        <>
            {/*<ItemSelector
            onSelect={onSelectItems}
            allItems={items}
            initialSelectedItemIds={selectedItems.map(item => item.id)}
            rightFooter={rightFooter}
            // TODO: Pass in a func prop to fetch items, instead of fetching them on this level, to enable the loading spinner?
        />*/}
            <ItemSelector
                initialSelected={selectedItems}
                noItemsMessage={i18n.t('Nothing found in {{dimensionTitle}}', {
                    dimensionTitle,
                })}
                onFetch={fetchItemsEndpoint}
                onSelect={onSelectItems}
                rightFooter={rightFooter}
            />
        </>
    )
}

DynamicDimension.propTypes = {
    dimensionId: PropTypes.string.isRequired,
    dimensionTitle: PropTypes.string.isRequired,
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
