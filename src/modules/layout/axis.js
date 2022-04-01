// Axis

export const AXIS = {
    defaultValue: [],
    isValid: (axis) => Array.isArray(axis),
}

// Axis ids

export const AXIS_ID_COLUMNS = 'columns'
export const AXIS_ID_ROWS = 'rows'
export const AXIS_ID_FILTERS = 'filters'
export const AXIS_ID_YEAR_OVER_YEAR_SERIES = 'yearOverYearSeries'
export const AXIS_ID_YEAR_OVER_YEAR_CATEGORY = 'yearOverYearCategory'
//export const AXIS_ID_POINTS_CATEGORY = 'pointsCategory'

export const DEFAULT_AXIS_IDS = [AXIS_ID_COLUMNS, AXIS_ID_ROWS, AXIS_ID_FILTERS]
export const ALL_AXIS_IDS = [
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
    AXIS_ID_YEAR_OVER_YEAR_SERIES,
    AXIS_ID_YEAR_OVER_YEAR_CATEGORY,
]
