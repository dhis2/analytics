export default function(acc, seriesIds, categoryIds, idValueMap, metaData) {
    acc.push(
        ...seriesIds.map(seriesId => ({
            name: metaData.items[seriesId].name,
            y: parseFloat(idValueMap.get(seriesId)),
        }))
    )
}
