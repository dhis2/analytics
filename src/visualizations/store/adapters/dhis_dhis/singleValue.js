export default function (acc, seriesIds, categoryIds, idValueMap) {
    const seriesId = seriesIds[0]

    acc.push(idValueMap.get(seriesId))
}
