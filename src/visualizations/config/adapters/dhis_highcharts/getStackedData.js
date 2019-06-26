export default function(series, isZeroAsNull) {
    return series[0].data
        .map((value, index) => {
            return series.reduce((total, obj) => {
                return total + obj.data[index]
            }, 0)
        })
        .map(value => (isZeroAsNull && value === 0 ? null : value))
}
