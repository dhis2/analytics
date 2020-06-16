import { AXIS_ID_COLUMNS, AXIS_ID_ROWS, AXIS_ID_FILTERS } from '../layout/axis'
import { DIMENSION_ID_PERIOD, DIMENSION_ID_DATA } from '../predefinedDimensions'
import {
    VIS_TYPE_COLUMN,
    VIS_TYPE_STACKED_COLUMN,
    VIS_TYPE_BAR,
    VIS_TYPE_STACKED_BAR,
    VIS_TYPE_LINE,
    VIS_TYPE_AREA,
    VIS_TYPE_RADAR,
    VIS_TYPE_GAUGE,
    VIS_TYPE_PIE,
    VIS_TYPE_SINGLE_VALUE,
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_PIVOT_TABLE,
} from '../visTypes'

const RULE_PROP_AVAILABLE_AXES = 'availableAxes',
    RULE_PROP_MAX_DIMS_PER_AXIS = 'maxNumberOfDimsPerAxis',
    RULE_PROP_MIN_DIMS_PER_AXIS = 'minNumberOfDimsPerAxis',
    RULE_PROP_MAX_ITEMS_PER_AXIS = 'maxNumberOfItemsPerAxis',
    RULE_PROP_DISALLOWED_DIMS = 'disallowedDims',
    RULE_PROP_LOCKED_DIMS = 'lockedDims'

const defaultRules = {
    [RULE_PROP_AVAILABLE_AXES]: [
        AXIS_ID_COLUMNS,
        AXIS_ID_ROWS,
        AXIS_ID_FILTERS,
    ],
    [RULE_PROP_MAX_DIMS_PER_AXIS]: {
        [AXIS_ID_COLUMNS]: 1,
        [AXIS_ID_ROWS]: 1,
    },
    [RULE_PROP_MIN_DIMS_PER_AXIS]: {
        [AXIS_ID_COLUMNS]: 1,
        [AXIS_ID_ROWS]: 1,
    },
}

const pieRules = {
    [RULE_PROP_AVAILABLE_AXES]: [AXIS_ID_COLUMNS, AXIS_ID_FILTERS],
    [RULE_PROP_MAX_DIMS_PER_AXIS]: {
        [AXIS_ID_COLUMNS]: 1,
    },
    [RULE_PROP_MIN_DIMS_PER_AXIS]: {
        [AXIS_ID_COLUMNS]: 1,
    },
}

const singleValueRules = {
    [RULE_PROP_AVAILABLE_AXES]: [AXIS_ID_FILTERS],
    [RULE_PROP_MAX_DIMS_PER_AXIS]: {
        [AXIS_ID_COLUMNS]: 1,
    },
    [RULE_PROP_MIN_DIMS_PER_AXIS]: {
        [AXIS_ID_COLUMNS]: 1,
    },
    [RULE_PROP_MAX_ITEMS_PER_AXIS]: {
        [AXIS_ID_COLUMNS]: 1,
    },
    [RULE_PROP_LOCKED_DIMS]: {
        [DIMENSION_ID_DATA]: AXIS_ID_COLUMNS,
    },
}

const yearOverYearRules = {
    [RULE_PROP_AVAILABLE_AXES]: [AXIS_ID_FILTERS],
    [RULE_PROP_DISALLOWED_DIMS]: [DIMENSION_ID_PERIOD],
}

const pivotTableRules = {
    [RULE_PROP_AVAILABLE_AXES]: [
        AXIS_ID_COLUMNS,
        AXIS_ID_ROWS,
        AXIS_ID_FILTERS,
    ],
}

const columnRules = {
    [RULE_PROP_AVAILABLE_AXES]: [
        AXIS_ID_COLUMNS,
        AXIS_ID_ROWS,
        AXIS_ID_FILTERS,
    ],
    [RULE_PROP_MAX_DIMS_PER_AXIS]: {
        [AXIS_ID_COLUMNS]: 1,
        //     [AXIS_ID_ROWS]: 2,
    },
    [RULE_PROP_MIN_DIMS_PER_AXIS]: {
        [AXIS_ID_COLUMNS]: 1,
        [AXIS_ID_ROWS]: 1,
    },
}

const visTypeToRules = {
    [VIS_TYPE_COLUMN]: columnRules,
    [VIS_TYPE_STACKED_COLUMN]: defaultRules,
    [VIS_TYPE_BAR]: defaultRules,
    [VIS_TYPE_STACKED_BAR]: defaultRules,
    [VIS_TYPE_LINE]: columnRules,
    [VIS_TYPE_AREA]: defaultRules,
    [VIS_TYPE_RADAR]: defaultRules,
    [VIS_TYPE_GAUGE]: singleValueRules,
    [VIS_TYPE_PIE]: pieRules,
    [VIS_TYPE_SINGLE_VALUE]: singleValueRules,
    [VIS_TYPE_YEAR_OVER_YEAR_LINE]: yearOverYearRules,
    [VIS_TYPE_YEAR_OVER_YEAR_COLUMN]: yearOverYearRules,
    [VIS_TYPE_PIVOT_TABLE]: pivotTableRules,
}

const getRulesByVisType = visType => {
    const rules = visTypeToRules[visType]

    if (!rules) {
        throw new Error(`${visType} is not a known visualization type`)
    }

    return rules
}

// Selectors

export const getAvailableAxesByVisType = visType =>
    getRulesByVisType(visType)[RULE_PROP_AVAILABLE_AXES] || []

export const getMaxNumberOfDimsPerAxisByVisType = visType =>
    getRulesByVisType(visType)[RULE_PROP_MAX_DIMS_PER_AXIS] || {}

export const getMinNumberOfDimsPerAxisByVisType = visType =>
    getRulesByVisType(visType)[RULE_PROP_MIN_DIMS_PER_AXIS] || {}

export const getMaxNumberOfItemsPerAxisByVisType = visType =>
    getRulesByVisType(visType)[RULE_PROP_MAX_ITEMS_PER_AXIS] || {}

export const getDisallowedDimsByVisType = visType =>
    getRulesByVisType(visType)[RULE_PROP_DISALLOWED_DIMS] || []

export const getLockedDimsByVisType = visType =>
    getRulesByVisType(visType)[RULE_PROP_LOCKED_DIMS] || {}

// Test exports

export const testResourceRequiredProps = [RULE_PROP_AVAILABLE_AXES]

export const testResourceRules = [...new Set(Object.values(visTypeToRules))]

export const testResourceAllRuleProps = {
    AVAILABLE_AXES: RULE_PROP_AVAILABLE_AXES,
    MAX_DIMS_PER_AXIS: RULE_PROP_MAX_DIMS_PER_AXIS,
    MIN_DIMS_PER_AXIS: RULE_PROP_MIN_DIMS_PER_AXIS,
    MAX_ITEMS_PER_AXIS: RULE_PROP_MAX_ITEMS_PER_AXIS,
    DISALLOWED_DIMS: RULE_PROP_DISALLOWED_DIMS,
    LOCKED_DIMS: RULE_PROP_LOCKED_DIMS,
}
