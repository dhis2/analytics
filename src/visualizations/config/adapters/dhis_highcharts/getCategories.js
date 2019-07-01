import isArray from 'd2-utilizr/lib/isArray'

export default function(metaData, layout) {
    const dimensionName = layout.rows[0].dimension

    const dimensionIds = isArray(metaData.dimensions[dimensionName])
        ? metaData.dimensions[dimensionName]
        : []

    return dimensionIds.map(id => metaData.items[id].name)
}
