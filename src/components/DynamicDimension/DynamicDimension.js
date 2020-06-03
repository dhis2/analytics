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
        setItems(await apiFetchItemsByDimension(context, dimensionId))
    // TODO: This needs to be refactored to use a loading spinner once Transfer supports it: https://jira.dhis2.org/browse/TECH-379

    const selectItems = items => {
        const formattedItems = items.map(item => ({
            id: item.value,
            name: item.label,
        }))
        onSelect({
            dimensionId: dimensionId,
            items: formattedItems,
        })
    }

    return (
        <ItemSelector
            onSelect={selectItems}
            allItems={items}
            initialSelectedItems={selectedItems}
            rightFooter={rightFooter}
            // TODO: Pass in a func prop to fetch items, instead of fetching them on this level, to enable the loading spinner?
        />
    )
}

DynamicDimension.propTypes = {
    context: PropTypes.object.isRequired,
    dimensionId: PropTypes.string.isRequired,
    selectedItems: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    rightFooter: PropTypes.node,
}

DynamicDimension.defaultProps = {
    selectedItems: [],
    onSelect: Function.prototype,
}

export default DynamicDimension
