export const layoutFilterDimensions = (layout, dimensionIds) => {
    const idArray = Array.isArray(dimensionIds) ? dimensionIds : [dimensionIds]
    const filteredLayout = Object.assign({}, layout)

    AXIS_NAMES.forEach(axisName => {
        if (AXIS.validate(filteredLayout[axisName])) {
            filteredLayout[axisName] = filteredLayout[axisName].filter(
                dimension => !idArray.includes(dimensionGetId(dimension))
            )
        }
    })

    return filteredLayout
}
