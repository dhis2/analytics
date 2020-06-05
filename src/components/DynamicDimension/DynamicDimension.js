import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import ItemSelector from './ItemSelector'
import { apiFetchItemsByDimension } from '../../api/dimensions'

export const DynamicDimension = ({
    context,
    dimensionId,
    onSelect,
    selectedItems,
    rightFooter,
}) => {
    const [items, setItems] = useState([])

    useEffect(() => {
        if (!items || !items.length) {
            getItems()
        }
    }, [])

    const getItems = async () =>
        setItems(await apiFetchItemsByDimension(context, dimensionId)) // TODO: refactor to use the data engine instead
    // TODO: *** Once pagination is in use, check if there are items that are in selectedItems that needs to be added to the items list
    // TODO: This needs to be refactored to use a loading spinner once Transfer supports it: https://jira.dhis2.org/browse/TECH-379

    const onSelectItems = selectedItemIds => {
        const formattedItems = selectedItemIds.map(id => ({
            id,
            name: items.find(item => item.id === id).name, // TODO: Re: *** above, this won't work with pagination
        })) // TODO: fetch the name from somewhere else, as not all content in selectedItems might be present in the items list
        onSelect({
            dimensionId: dimensionId,
            items: formattedItems,
        })
    }

    return (
        <ItemSelector
            onSelect={onSelectItems}
            allItems={items}
            initialSelectedItemIds={selectedItems.map(item => item.id)}
            rightFooter={rightFooter}
            // TODO: Pass in a func prop to fetch items, instead of fetching them on this level, to enable the loading spinner?
        />
    )
}

DynamicDimension.propTypes = {
    context: PropTypes.object.isRequired,
    dimensionId: PropTypes.string.isRequired,
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
