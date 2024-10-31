export default function getSingleValue(
    acc,
    seriesIds,
    categoryIds,
    idValueMap
) {
    const seriesId = seriesIds[0][0]
    acc.push(idValueMap.get(seriesId))
}
