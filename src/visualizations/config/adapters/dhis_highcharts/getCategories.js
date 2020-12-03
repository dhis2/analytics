import isArray from 'd2-utilizr/lib/isArray'

export default function(metaData, dimensionId) {
    const dimensionItemsIds = isArray(metaData.dimensions[dimensionId])
        ? metaData.dimensions[dimensionId]
        : []

    return dimensionItemsIds.map(id => metaData.items[id].name)
}
