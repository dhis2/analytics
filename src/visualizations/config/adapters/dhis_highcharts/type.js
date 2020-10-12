import {
    VIS_TYPE_BAR,
    VIS_TYPE_STACKED_BAR,
    VIS_TYPE_LINE,
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_AREA,
    VIS_TYPE_STACKED_AREA,
    VIS_TYPE_PIE,
    VIS_TYPE_RADAR,
    VIS_TYPE_GAUGE,
    VIS_TYPE_COLUMN,
    VIS_TYPE_STACKED_COLUMN,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_SCATTER,
    VIS_TYPE_BUBBLE,
} from '../../../../modules/visTypes'

export default function(type) {
    switch (type) {
        case VIS_TYPE_BAR:
        case VIS_TYPE_STACKED_BAR:
            return { type: 'bar' }
        case VIS_TYPE_LINE:
        case VIS_TYPE_YEAR_OVER_YEAR_LINE:
            return { type: 'line' }
        case VIS_TYPE_AREA:
        case VIS_TYPE_STACKED_AREA:
            return { type: 'area' }
        case VIS_TYPE_PIE:
            return { type: 'pie' }
        case VIS_TYPE_RADAR:
            return { type: 'line', polar: true }
        case VIS_TYPE_GAUGE:
            return { type: 'solidgauge' }
        case VIS_TYPE_SCATTER: 
            return { type: 'scatter' }
        case VIS_TYPE_BUBBLE: 
            return { type: 'bubble' }
        case VIS_TYPE_COLUMN:
        case VIS_TYPE_STACKED_COLUMN:
        case VIS_TYPE_YEAR_OVER_YEAR_COLUMN:
        default:
            return { type: 'column' }
    }
}
