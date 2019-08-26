// Axis

export const AXIS = {
    defaultValue: [],
    isValid: axis => Array.isArray(axis),
}

// Axis names

export const AXIS_NAME_COLUMNS = 'columns'
export const AXIS_NAME_ROWS = 'rows'
export const AXIS_NAME_FILTERS = 'filters'

export const AXIS_NAMES = [AXIS_NAME_COLUMNS, AXIS_NAME_ROWS, AXIS_NAME_FILTERS]

export const axisIsValid = axisName => AXIS_NAMES.includes(axisName)
