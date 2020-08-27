export default function(acc, series, categories, idValueMap) {
    const serieData = []

    categories[0].forEach(categoryItemId => {
        const value = idValueMap.get(categoryItemId)

        // DHIS2-1261: 0 is a valid value
        // undefined value means the key was not found within the rows
        // in that case null is returned as value in the serie for highcharts
        serieData.push(value === undefined ? null : parseFloat(value))
    })

    acc.push({
        name: '', //TODO: not used?
        data: serieData,
    })

    return acc
}