import {
    AXIS_NAME_COLUMNS,
    AXIS_NAME_ROWS,
    AXIS_NAME_FILTERS,
} from '../layout/axis'
import { DIMENSION_ID_PERIOD } from '../fixedDimensions'
import {
    LAYOUT_TYPE_DEFAULT,
    LAYOUT_TYPE_PIE,
    LAYOUT_TYPE_SINGLE_VALUE,
    LAYOUT_TYPE_YEAR_OVER_YEAR,
} from '../layoutTypes'

const layoutTypeToRules = {
    [LAYOUT_TYPE_DEFAULT]: {
        availableAxes: [AXIS_NAME_COLUMNS, AXIS_NAME_ROWS, AXIS_NAME_FILTERS],
        maxNumberOfDimsPerAxis: {
            [AXIS_NAME_COLUMNS]: 1,
            [AXIS_NAME_ROWS]: 1,
        },
        minNumberOfDimsPerAxis: {
            [AXIS_NAME_COLUMNS]: 1,
            [AXIS_NAME_ROWS]: 1,
        },
    },
    [LAYOUT_TYPE_PIE]: {
        availableAxes: [AXIS_NAME_COLUMNS, AXIS_NAME_FILTERS],
        maxNumberOfDimsPerAxis: {
            [AXIS_NAME_COLUMNS]: 1,
        },
        minNumberOfDimsPerAxis: {
            [AXIS_NAME_COLUMNS]: 1,
        },
    },
    [LAYOUT_TYPE_SINGLE_VALUE]: {
        availableAxes: [AXIS_NAME_COLUMNS, AXIS_NAME_FILTERS],
        maxNumberOfDimsPerAxis: {
            [AXIS_NAME_COLUMNS]: 1,
        },
        minNumberOfDimsPerAxis: {
            [AXIS_NAME_COLUMNS]: 1,
        },
        maxNumberOfItemsPerAxis: {
            [AXIS_NAME_COLUMNS]: 1,
        },
    },
    [LAYOUT_TYPE_YEAR_OVER_YEAR]: {
        availableAxes: [AXIS_NAME_FILTERS],
        disallowedDims: [DIMENSION_ID_PERIOD],
    },
}

export const getRulesByLayoutType = layoutType => layoutTypeToRules[layoutType]
