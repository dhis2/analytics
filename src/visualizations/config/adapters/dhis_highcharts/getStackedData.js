import { isTwoCategoryChartType } from '../../../../modules/visTypes'

export default function(series, layout) {
    if (isTwoCategoryChartType(layout.type) && layout.rows.length > 1) {
        return getTwoCategoryStackedData(series)
    } else {
        return getDefaultStackedData(series)
    }
}

function getDefaultStackedData(series, isZeroAsNull) {
    return series[0].data
        .map((value, index) => {
            return series.reduce((total, obj) => {
                return total + obj.data[index]
            }, 0)
        })
        .map(value => (isZeroAsNull && value === 0 ? null : value))
}

function getTwoCategoryStackedData(series) {
    return series[0].custom.data.map((groupObj, groupIndex) => {
        return groupObj.map((value, index) => {
            return series
                .filter(serieObj => !serieObj.custom.isTwoCategoryFakeSerie)
                .reduce((total, serieObj) => {
                    return total + serieObj.custom.data[groupIndex][index]
                }, 0)
        })
    })
}
