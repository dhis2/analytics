export default function(type) {
    switch (type) {
        case VIS_TYPE_BAR:
        case VIS_TYPE_STACKED_BAR:
        case VIS_TYPE_STACKED_BAR_LEGACY:
            return { type: 'bar' }
        case VIS_TYPE_LINE:
        case VIS_TYPE_YEAR_OVER_YEAR_LINE:
            return { type: 'line' }
        case VIS_TYPE_AREA:
            return { type: 'area' }
        case VIS_TYPE_PIE:
            return { type: 'pie' }
        case VIS_TYPE_RADAR:
            return { type: 'line', polar: true }
        case VIS_TYPE_GAUGE:
            return { type: 'solidgauge' }
        case VIS_TYPE_COLUMN:
        case VIS_TYPE_STACKED_COLUMN:
        case VIS_TYPE_STACKED_COLUMN_LEGACY:
        case VIS_TYPE_YEAR_OVER_YEAR_COLUMN:
        default:
            return { type: 'column' }
    }
}
