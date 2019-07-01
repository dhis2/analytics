import { hasExtraAxisItems } from './seriesItems'
import { isDualAxis } from './type'

const DATA_DIMENSION_ID = 'dx'

function isDataSeries(columns) {
    return (
        Array.isArray(columns) &&
        columns[0] &&
        columns[0].dimension === DATA_DIMENSION_ID
    )
}

function hasMultipleSeriesItems(columns) {
    return (
        Array.isArray(columns) &&
        columns[0] &&
        Array.isArray(columns[0].items) &&
        columns[0].items.length > 1
    )
}

export function shouldHaveDualAxis(layout) {
    return (
        isDualAxis(layout.type) &&
        isDataSeries(layout.columns) &&
        hasMultipleSeriesItems(layout.columns) &&
        hasExtraAxisItems(layout.seriesItems, layout.columns)
    )
}
