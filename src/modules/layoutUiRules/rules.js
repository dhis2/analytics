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

const RULE_PROP_AVAILABLE_AXES = {
    name: 'availableAxes',
    isValid: prop => Array.isArray(prop),
}

const defaultRules = {
    [RULE_PROP_AVAILABLE_AXES.name]: [
        AXIS_NAME_COLUMNS,
        AXIS_NAME_ROWS,
        AXIS_NAME_FILTERS,
    ],
    maxNumberOfDimsPerAxis: {
        [AXIS_NAME_COLUMNS]: 1,
        [AXIS_NAME_ROWS]: 1,
    },
    minNumberOfDimsPerAxis: {
        [AXIS_NAME_COLUMNS]: 1,
        [AXIS_NAME_ROWS]: 1,
    },
}

const pieRules = {
    [RULE_PROP_AVAILABLE_AXES.name]: [AXIS_NAME_COLUMNS, AXIS_NAME_FILTERS],
    maxNumberOfDimsPerAxis: {
        [AXIS_NAME_COLUMNS]: 1,
    },
    minNumberOfDimsPerAxis: {
        [AXIS_NAME_COLUMNS]: 1,
    },
}

const singleValueRules = {
    [RULE_PROP_AVAILABLE_AXES.name]: [AXIS_NAME_COLUMNS, AXIS_NAME_FILTERS],
    maxNumberOfDimsPerAxis: {
        [AXIS_NAME_COLUMNS]: 1,
    },
    minNumberOfDimsPerAxis: {
        [AXIS_NAME_COLUMNS]: 1,
    },
    maxNumberOfItemsPerAxis: {
        [AXIS_NAME_COLUMNS]: 1,
    },
}

const yearOverYearRules = {
    [RULE_PROP_AVAILABLE_AXES.name]: [AXIS_NAME_FILTERS],
    disallowedDims: [DIMENSION_ID_PERIOD],
}

const layoutTypeToRules = {
    [LAYOUT_TYPE_DEFAULT]: defaultRules,
    [LAYOUT_TYPE_PIE]: pieRules,
    [LAYOUT_TYPE_SINGLE_VALUE]: singleValueRules,
    [LAYOUT_TYPE_YEAR_OVER_YEAR]: yearOverYearRules,
}

export const getRulesByLayoutType = layoutType => layoutTypeToRules[layoutType]

// Test exports

export const testResourceRules = Object.values(layoutTypeToRules)

export const testResourceRequiredProps = [RULE_PROP_AVAILABLE_AXES]
