import { DIMENSION_ID_DATA, DIMENSION_ID_PERIOD } from '../predefinedDimensions'
import { AXIS_ID_COLUMNS, AXIS_ID_ROWS, AXIS_ID_FILTERS } from './axis'
import {
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_PIE,
    VIS_TYPE_GAUGE,
    VIS_TYPE_SINGLE_VALUE,
    VIS_TYPE_PIVOT_TABLE,
    isTwoCategoryChartType,
} from '../visTypes'

export const layoutGetAdaptedLayoutByType = (layout, type) => {
    if (isTwoCategoryChartType(type) && layout.rows.length > 1) {
        return getDualCategoryLayout(layout)
    }
    switch (type) {
        case VIS_TYPE_YEAR_OVER_YEAR_LINE:
        case VIS_TYPE_YEAR_OVER_YEAR_COLUMN: {
            return getYearOverYearLayout(layout)
        }
        case VIS_TYPE_PIE: {
            return getPieLayout(layout)
        }
        case VIS_TYPE_SINGLE_VALUE:
        case VIS_TYPE_GAUGE: {
            return getSingleValueLayout(layout)
        }
        case VIS_TYPE_PIVOT_TABLE:
            return layout
        default:
            return getDefaultLayout(layout)
    }
}

// Transform from ui.layout to default layout format
const getDefaultLayout = layout => {
    const columns = layout[AXIS_ID_COLUMNS].slice()
    const rows = layout[AXIS_ID_ROWS].slice()

    return {
        [AXIS_ID_COLUMNS]: columns.length ? [columns.shift()] : columns,
        [AXIS_ID_ROWS]: rows.length ? [rows.shift()] : rows,
        [AXIS_ID_FILTERS]: [...layout[AXIS_ID_FILTERS], ...columns, ...rows],
    }
}

const getDualCategoryLayout = layout => {
    const columns = layout[AXIS_ID_COLUMNS].slice()
    const rows = layout[AXIS_ID_ROWS].slice()

    return {
        [AXIS_ID_COLUMNS]: columns.length ? [columns.shift()] : columns,
        [AXIS_ID_ROWS]:
            rows.length > 2 ? rows.splice(0, 2) : rows.splice(0, rows.length),
        [AXIS_ID_FILTERS]: [...layout[AXIS_ID_FILTERS], ...columns, ...rows],
    }
}

// Transform from ui.layout to pie layout format
const getPieLayout = layout => {
    const columns = layout[AXIS_ID_COLUMNS].slice()
    const rows = layout[AXIS_ID_ROWS].slice()

    return {
        [AXIS_ID_COLUMNS]: columns.length
            ? [columns.shift()]
            : rows.length
            ? [rows.shift()]
            : [],
        [AXIS_ID_ROWS]: [],
        [AXIS_ID_FILTERS]: [...layout[AXIS_ID_FILTERS], ...columns, ...rows],
    }
}

// Transform from ui.layout to year on year layout format
const getYearOverYearLayout = layout => ({
    [AXIS_ID_COLUMNS]: [],
    [AXIS_ID_ROWS]: [],
    [AXIS_ID_FILTERS]: [
        ...layout[AXIS_ID_FILTERS],
        ...layout[AXIS_ID_COLUMNS],
        ...layout[AXIS_ID_ROWS],
    ].filter(dim => dim !== DIMENSION_ID_PERIOD),
})

// Transform from ui.layout to single value layout format
const getSingleValueLayout = layout => {
    const columns = layout[AXIS_ID_COLUMNS].slice()
    const rows = layout[AXIS_ID_ROWS].slice()

    return {
        [AXIS_ID_COLUMNS]: [DIMENSION_ID_DATA],
        [AXIS_ID_ROWS]: [],
        [AXIS_ID_FILTERS]: [
            ...layout[AXIS_ID_FILTERS],
            ...columns,
            ...rows,
        ].filter(dim => dim !== DIMENSION_ID_DATA),
    }
}
