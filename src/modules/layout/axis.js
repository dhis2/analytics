// Axis

export const AXIS = {
    defaultValue: [],
    isValid: axis => Array.isArray(axis),
}

// Axis names

export const AXIS_NAME_COLUMNS = 'columns'
export const AXIS_NAME_ROWS = 'rows'
export const AXIS_NAME_FILTERS = 'filters'
export const AXIS_NAME_YEAR_OVER_YEAR_SERIES = 'yearOverYearSeries'
export const AXIS_NAME_YEAR_OVER_YEAR_CATEGORY = 'yearOverYearCategory'

export const DEFAULT_AXIS_NAMES = [
    AXIS_NAME_COLUMNS,
    AXIS_NAME_ROWS,
    AXIS_NAME_FILTERS,
]
