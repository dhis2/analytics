// Shared test resources

import { ITEM_PROP_ID } from '../item'
import { DIMENSION_PROP_ID } from '../dimension'
import { AXIS_NAME_ROWS, AXIS_NAME_COLUMNS, AXIS_NAME_FILTERS } from '../axis'
import {
    DIMENSION_ID_DATA,
    DIMENSION_ID_PERIOD,
    DIMENSION_ID_ORGUNIT,
} from '../../fixedDimensions'

const DIMENSION_ID_DYNAMIC = 'dynamicUid'

// Items

export const TEST_ITEM_1 = {
    [ITEM_PROP_ID.name]: 'dxItem1Id',
}

export const TEST_ITEM_2 = {
    [ITEM_PROP_ID.name]: 'dxItem2Id',
}

export const TEST_ITEM_3 = {
    [ITEM_PROP_ID.name]: 'peItem1Id',
}

export const TEST_ITEM_4 = {
    [ITEM_PROP_ID.name]: 'ouItem1Id',
}

export const TEST_ITEM_5 = {
    [ITEM_PROP_ID.name]: 'dynamicItem1Id',
}

// Dimensions

export const TEST_DIMENSION_1 = {
    [DIMENSION_PROP_ID.name]: DIMENSION_ID_DATA,
    items: [TEST_ITEM_1, TEST_ITEM_2],
}

export const TEST_DIMENSION_2 = {
    [DIMENSION_PROP_ID.name]: DIMENSION_ID_PERIOD,
    items: [TEST_ITEM_3],
}

export const TEST_DIMENSION_3 = {
    [DIMENSION_PROP_ID.name]: DIMENSION_ID_ORGUNIT,
    items: [TEST_ITEM_4],
}

export const TEST_DIMENSION_4 = {
    [DIMENSION_PROP_ID.name]: DIMENSION_ID_DYNAMIC,
    items: [TEST_ITEM_5],
}

// Axes

export const TEST_AXIS_1 = [TEST_DIMENSION_1]

export const TEST_AXIS_2 = [TEST_DIMENSION_2]

export const TEST_AXIS_3 = [TEST_DIMENSION_3, TEST_DIMENSION_4]

// Layout

export const TEST_LAYOUT = {
    [AXIS_NAME_COLUMNS]: TEST_AXIS_1,
    [AXIS_NAME_ROWS]: TEST_AXIS_2,
    [AXIS_NAME_FILTERS]: TEST_AXIS_3,
}
