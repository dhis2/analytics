export default function(series, isZeroAsNull) {
    return series[0].data
        .map((value, index) => {
            return series.reduce((total, obj) => {
                return total + obj.data[index]
            }, 0)
        })
        .map(value => (isZeroAsNull && value === 0 ? null : value))
}

export function getDualCategoryStackedData(series) {
    return series[0].data.map((groupObj, groupIndex) => {
        return groupObj.map((value, index) => {
            return series.reduce((total, serieObj) => {
                return total + serieObj.data[groupIndex][index]
            }, 0)
        })
    })
}
