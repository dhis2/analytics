import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { useDataQuery } from '@dhis2/app-runtime'
import ItemSelector from './ItemSelector'

const itemsByDimensionQuery = {
    itemsByDimension: {
        resource: 'dimensions',
        id: ({ id }) => `${id}/items`, // TODO replace with the new way when available
        params: {
            fields: 'id,displayName~rename(name)',
            order: 'displayName:asc',
            //paging: false, // XXX needed?!
        },
    },
}

export const DynamicDimension = ({
    dimensionId,
    onSelect,
    selectedItems,
    rightFooter,
}) => {
    const [items, setItems] = useState([])

    // TODO: *** Once pagination is in use, check if there are items that are in selectedItems that needs to be added to the items list
    // TODO: This needs to be refactored to use a loading spinner once Transfer supports it: https://jira.dhis2.org/browse/TECH-379

    const { data, refetch } = useDataQuery(itemsByDimensionQuery, {
        lazy: true,
    })

    const fetchItemsByDimension = id => refetch({ id })

    useEffect(() => {
        fetchItemsByDimension(dimensionId)
    }, [dimensionId])

    useEffect(() => {
        if (data?.itemsByDimension) {
            setItems(data.itemsByDimension.items)
        }
    }, [data])

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
