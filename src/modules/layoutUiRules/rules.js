import {
    AXIS_NAME_COLUMNS,
    AXIS_NAME_ROWS,
    AXIS_NAME_FILTERS,
} from '../layout/axis'
import { DIMENSION_ID_PERIOD } from '../fixedDimensions'
import {
    COLUMN,
    STACKED_COLUMN,
    BAR,
    STACKED_BAR,
    LINE,
    AREA,
    PIE,
    RADAR,
    GAUGE,
    YEAR_OVER_YEAR_LINE,
    YEAR_OVER_YEAR_COLUMN,
    SINGLE_VALUE,
} from '../visTypes'

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
    [RULE_PROP_AVAILABLE_AXES.name]: [AXIS_NAME_FILTERS],
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

const visTypeToRules = {
    [COLUMN]: defaultRules,
    [STACKED_COLUMN]: defaultRules,
    [BAR]: defaultRules,
    [STACKED_BAR]: defaultRules,
    [LINE]: defaultRules,
    [AREA]: defaultRules,
    [RADAR]: defaultRules,
    [GAUGE]: defaultRules,
    [PIE]: pieRules,
    [SINGLE_VALUE]: singleValueRules,
    [YEAR_OVER_YEAR_LINE]: yearOverYearRules,
    [YEAR_OVER_YEAR_COLUMN]: yearOverYearRules,
}

export const getRulesByVisType = visType => visTypeToRules[visType]

// Test exports

export const testResourceRules = Object.values(visTypeToRules)

export const testResourceRequiredProps = [RULE_PROP_AVAILABLE_AXES]
