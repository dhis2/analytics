export default function(acc, seriesIds, categoryIds, idValueMap, metaData) {
    const seriesId = seriesIds[0]

    acc.push({
        data: [parseFloat(idValueMap.get(seriesId))],
    })
}
