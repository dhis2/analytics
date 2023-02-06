export default function getTwoCategorySplitSerieData(serieData) {
    // Add a null value after the last point of the first group
    // this results in 2 separated charts for line and area
    const splitSerieData = []
    let index = 0

    serieData.forEach((groupData, groupIndex) => {
        groupData.map((point) => splitSerieData.push([index++, point]))

        if (groupIndex + 1 < serieData.length) {
            splitSerieData.push([index - 0.5, null])
        }
    })

    return splitSerieData
}
