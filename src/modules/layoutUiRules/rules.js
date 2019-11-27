import { AXIS_ID_COLUMNS, AXIS_ID_ROWS, AXIS_ID_FILTERS } from '../layout/axis'
import { DIMENSION_ID_PERIOD, DIMENSION_ID_DATA } from '../fixedDimensions'

const RULE_PROP_AVAILABLE_AXES = {
    name: 'availableAxes',
    isValid: prop => Array.isArray(prop),
}

export const defaultRules = {
    [RULE_PROP_AVAILABLE_AXES.name]: [
        AXIS_ID_COLUMNS,
        AXIS_ID_ROWS,
        AXIS_ID_FILTERS,
    ],
    maxNumberOfDimsPerAxis: {
        [AXIS_ID_COLUMNS]: 1,
        [AXIS_ID_ROWS]: 1,
    },
    minNumberOfDimsPerAxis: {
        [AXIS_ID_COLUMNS]: 1,
        [AXIS_ID_ROWS]: 1,
    },
}

export const pieRules = {
    [RULE_PROP_AVAILABLE_AXES.name]: [AXIS_ID_COLUMNS, AXIS_ID_FILTERS],
    maxNumberOfDimsPerAxis: {
        [AXIS_ID_COLUMNS]: 1,
    },
    minNumberOfDimsPerAxis: {
        [AXIS_ID_COLUMNS]: 1,
    },
}

export const singleValueRules = {
    [RULE_PROP_AVAILABLE_AXES.name]: [AXIS_ID_FILTERS],
    maxNumberOfDimsPerAxis: {
        [AXIS_ID_COLUMNS]: 1,
    },
    minNumberOfDimsPerAxis: {
        [AXIS_ID_COLUMNS]: 1,
    },
    maxNumberOfItemsPerAxis: {
        [AXIS_ID_COLUMNS]: 1,
    },
    lockedDims: {
        [DIMENSION_ID_DATA]: AXIS_ID_COLUMNS,
    },
}

export const yearOverYearRules = {
    [RULE_PROP_AVAILABLE_AXES.name]: [AXIS_ID_FILTERS],
    disallowedDims: [DIMENSION_ID_PERIOD],
}

// Selectors

export const getAvailableAxesByRules = rules =>
    rules[RULE_PROP_AVAILABLE_AXES.name] || []

export const getMaxNumberOfDimsPerAxisByRules = rules =>
    rules.maxNumberOfDimsPerAxis || {}

export const getMinNumberOfDimsPerAxisByRules = rules =>
    rules.minNumberOfDimsPerAxis || {}

export const getMaxNumberOfItemsPerAxisByRules = rules =>
    rules.maxNumberOfItemsPerAxis || {}

export const getDisallowedDimsByRules = rules => rules.disallowedDims || []

export const getLockedDimsByRules = rules => rules.lockedDims || {}

// Test exports

export const testResourceRules = Object.values(visTypeToRules)

export const testResourceRequiredProps = [RULE_PROP_AVAILABLE_AXES]
