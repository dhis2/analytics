export default function(acc, series, categories, idValueMap, metaData) {
    series[0].forEach(serieItemId => {
        const value = idValueMap.get(serieItemId)

        if (value) {
            acc.push({
                id: serieItemId,
                name: metaData.items[serieItemId].name,
                y: parseFloat(value),
            })
        }
    })

    return acc
}
