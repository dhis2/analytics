import { getRelativePeriodIds } from '../../components/PeriodDimension/utils/relativePeriods.js'
import {
    DIMENSION_ID_DATA,
    DIMENSION_ID_PERIOD,
    DIMENSION_ID_ORGUNIT,
} from '../predefinedDimensions.js'
import {
    AXIS_ID_ROWS,
    AXIS_ID_COLUMNS,
    AXIS_ID_FILTERS,
    DEFAULT_AXIS_IDS,
} from './axis.js'
import { DIMENSION_PROP_ID, DIMENSION_PROP_ITEMS } from './dimension.js'
import { ITEM_PROP_ID } from './item.js'

// Items

export const TEST_ITEM_ID_1 = 'dxItem1Id'
export const TEST_ITEM_ID_2 = 'dxItem2Id'
export const TEST_ITEM_ID_3 = 'peItem1Id'
export const TEST_ITEM_ID_4 = 'ouItem1Id'
export const TEST_ITEM_ID_5 = 'dynamicItem1Id'
export const TEST_ITEM_ID_6 = getRelativePeriodIds()[0]

export const TEST_ITEM_1 = {
    [ITEM_PROP_ID.name]: TEST_ITEM_ID_1,
}

export const TEST_ITEM_2 = {
    [ITEM_PROP_ID.name]: TEST_ITEM_ID_2,
}

export const TEST_ITEM_3 = {
    [ITEM_PROP_ID.name]: TEST_ITEM_ID_3,
}

export const TEST_ITEM_4 = {
    [ITEM_PROP_ID.name]: TEST_ITEM_ID_4,
}

export const TEST_ITEM_5 = {
    [ITEM_PROP_ID.name]: TEST_ITEM_ID_5,
}

export const TEST_ITEM_6 = {
    [ITEM_PROP_ID.name]: TEST_ITEM_ID_6,
}

export const TEST_ITEM_INVALID_1 = {
    [ITEM_PROP_ID.name]: 10,
}

export const TEST_ITEM_INVALID_2 = {
    chicken: TEST_ITEM_ID_1,
}

export const TEST_ITEMS_IN_AXIS_1 = [TEST_ITEM_1, TEST_ITEM_2]

export const TEST_ITEMS_IN_AXIS_2 = [TEST_ITEM_3]

export const TEST_ITEMS_IN_LAYOUT = [
    TEST_ITEM_1,
    TEST_ITEM_2,
    TEST_ITEM_3,
    TEST_ITEM_4,
    TEST_ITEM_5,
]

// Dimensions

export const DIMENSION_ID_DYNAMIC = 'dynamicUid'

export const TEST_DIMENSION_1 = {
    [DIMENSION_PROP_ID.name]: DIMENSION_ID_DATA,
    [DIMENSION_PROP_ITEMS.name]: [TEST_ITEM_1, TEST_ITEM_2],
}

export const TEST_DIMENSION_2 = {
    [DIMENSION_PROP_ID.name]: DIMENSION_ID_PERIOD,
    [DIMENSION_PROP_ITEMS.name]: [TEST_ITEM_3],
}

export const TEST_DIMENSION_3 = {
    [DIMENSION_PROP_ID.name]: DIMENSION_ID_ORGUNIT,
    [DIMENSION_PROP_ITEMS.name]: [TEST_ITEM_4],
}

export const TEST_DIMENSION_4 = {
    [DIMENSION_PROP_ID.name]: DIMENSION_ID_DYNAMIC,
    [DIMENSION_PROP_ITEMS.name]: [TEST_ITEM_5],
}

export const TEST_DIMENSION_5 = {
    [DIMENSION_PROP_ID.name]: DIMENSION_ID_PERIOD,
    [DIMENSION_PROP_ITEMS.name]: [TEST_ITEM_6],
}

export const TEST_DIMENSION_EMPTY_1 = {
    [DIMENSION_PROP_ID.name]: DIMENSION_ID_DATA,
    [DIMENSION_PROP_ITEMS.name]: [],
}

export const TEST_DIMENSION_INVALID_ID_1 = 'This prop is not an object'

export const TEST_DIMENSION_INVALID_ID_2 = {
    [DIMENSION_PROP_ID.name]: ['This prop is not a string'],
}

export const TEST_DIMENSION_INVALID_ITEMS_1 = {
    [DIMENSION_PROP_ID.name]: DIMENSION_ID_DATA,
    [DIMENSION_PROP_ITEMS.name]: 'This is not an array',
}

export const TEST_DIMENSIONS_IN_LAYOUT = [
    TEST_DIMENSION_1,
    TEST_DIMENSION_2,
    TEST_DIMENSION_3,
    TEST_DIMENSION_4,
]

// Axes

export const TEST_AXIS_COLUMNS = [TEST_DIMENSION_1]

export const TEST_AXIS_ROWS = [TEST_DIMENSION_2]

export const TEST_AXIS_FILTERS = [TEST_DIMENSION_3, TEST_DIMENSION_4]

export const TEST_AXIS_EMPTY = []

export const TEST_AXES_IN_LAYOUT = [
    TEST_AXIS_COLUMNS,
    TEST_AXIS_ROWS,
    TEST_AXIS_FILTERS,
]

export const TEST_AXIS_IDS_IN_LAYOUT = DEFAULT_AXIS_IDS

// Layout

export const TEST_LAYOUT = {
    [AXIS_ID_COLUMNS]: TEST_AXIS_COLUMNS,
    [AXIS_ID_ROWS]: TEST_AXIS_ROWS,
    [AXIS_ID_FILTERS]: TEST_AXIS_FILTERS,
}
