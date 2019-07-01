import arrayContains from 'd2-utilizr/lib/arrayContains'

export const CHART_TYPE_COLUMN = 'COLUMN'
export const CHART_TYPE_STACKED_COLUMN = 'STACKED_COLUMN'
export const CHART_TYPE_STACKED_COLUMN_LEGACY = 'STACKEDCOLUMN'
export const CHART_TYPE_BAR = 'BAR'
export const CHART_TYPE_STACKED_BAR = 'STACKED_BAR'
export const CHART_TYPE_STACKED_BAR_LEGACY = 'STACKEDBAR'
export const CHART_TYPE_LINE = 'LINE'
export const CHART_TYPE_AREA = 'AREA'
export const CHART_TYPE_PIE = 'PIE'
export const CHART_TYPE_RADAR = 'RADAR'
export const CHART_TYPE_GAUGE = 'GAUGE'
export const CHART_TYPE_YEAR_OVER_YEAR_LINE = 'YEAR_OVER_YEAR_LINE'
export const CHART_TYPE_YEAR_OVER_YEAR_COLUMN = 'YEAR_OVER_YEAR_COLUMN'

const stackedTypes = [
    CHART_TYPE_STACKED_COLUMN,
    CHART_TYPE_STACKED_COLUMN_LEGACY,
    CHART_TYPE_STACKED_BAR,
    CHART_TYPE_STACKED_BAR_LEGACY,
    CHART_TYPE_AREA,
]

const yearOverYearTypes = [
    CHART_TYPE_YEAR_OVER_YEAR_LINE,
    CHART_TYPE_YEAR_OVER_YEAR_COLUMN,
]

const dualAxisTypes = [CHART_TYPE_COLUMN, CHART_TYPE_BAR, CHART_TYPE_LINE]

export function getIsStacked(type) {
    return arrayContains(stackedTypes, type)
}

export function isYearOverYear(type) {
    return arrayContains(yearOverYearTypes, type)
}

export function isDualAxis(type) {
    return arrayContains(dualAxisTypes, type)
}

export default function(type) {
    switch (type) {
        case CHART_TYPE_BAR:
        case CHART_TYPE_STACKED_BAR:
        case CHART_TYPE_STACKED_BAR_LEGACY:
            return { type: 'bar' }
        case CHART_TYPE_LINE:
        case CHART_TYPE_YEAR_OVER_YEAR_LINE:
            return { type: 'line' }
        case CHART_TYPE_AREA:
            return { type: 'area' }
        case CHART_TYPE_PIE:
            return { type: 'pie' }
        case CHART_TYPE_RADAR:
            return { type: 'line', polar: true }
        case CHART_TYPE_GAUGE:
            return { type: 'solidgauge' }
        case CHART_TYPE_COLUMN:
        case CHART_TYPE_STACKED_COLUMN:
        case CHART_TYPE_STACKED_COLUMN_LEGACY:
        case CHART_TYPE_YEAR_OVER_YEAR_COLUMN:
        default:
            return { type: 'column' }
    }
}
