import isArray from 'd2-utilizr/lib/isArray'

export default function(metaData, dimensionId) {
    const dimensionItemIds = isArray(metaData.dimensions[dimensionId])
        ? metaData.dimensions[dimensionId]
        : []

    return dimensionItemIds.map(id => metaData.items[id].name)
}
