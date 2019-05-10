import {
    AXIS_NAME_COLUMNS,
    AXIS_NAME_ROWS,
    AXIS_NAME_FILTERS,
} from '../axis/axis'

export const layoutGetAllAxes = layout => [
    layout[AXIS_NAME_COLUMNS],
    layout[AXIS_NAME_ROWS],
    layout[AXIS_NAME_FILTERS],
]
