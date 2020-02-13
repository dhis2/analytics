export default function(acc, seriesIds, categoryIds, idValueMap, metaData) {
    seriesIds.forEach(seriesId => {
        const value = idValueMap.get(seriesId)

        if (value) {
            acc.push({
                name: metaData.items[seriesId].name,
                y: parseFloat(idValueMap.get(seriesId)),
            })
        }
    })
}