export default function (acc, series, categories, idValueMap) {
    const serieItemId = series[0][0]

    acc.push({
        data: [parseFloat(idValueMap.get(serieItemId))],
    })
}
