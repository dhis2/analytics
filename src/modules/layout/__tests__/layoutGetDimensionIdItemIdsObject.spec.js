import { layoutGetDimensionIdItemIdsObject } from '../layoutGetDimensionIdItemIdsObject'
import {
    TEST_LAYOUT,
    TEST_DIMENSION_1,
    TEST_DIMENSION_2,
    TEST_DIMENSION_3,
    TEST_DIMENSION_4,
} from '../testResources'
import { DIMENSION_PROP_ID, DIMENSION_PROP_ITEMS } from '../dimension'
import { ITEM_PROP_ID } from '../item'

const getDimensionId = dim => dim[DIMENSION_PROP_ID.name]
const getItemIds = dim =>
    dim[DIMENSION_PROP_ITEMS.name].map(item => item[ITEM_PROP_ID.name])

describe('layoutGetDimensionIdItemIdsObject', () => {
    it('should return a dimensionId:itemdIds object based on the layout', () => {
        const expectedState = {
            [getDimensionId(TEST_DIMENSION_1)]: getItemIds(TEST_DIMENSION_1),
            [getDimensionId(TEST_DIMENSION_2)]: getItemIds(TEST_DIMENSION_2),
            [getDimensionId(TEST_DIMENSION_3)]: getItemIds(TEST_DIMENSION_3),
            [getDimensionId(TEST_DIMENSION_4)]: getItemIds(TEST_DIMENSION_4),
        }
        expect(layoutGetDimensionIdItemIdsObject(TEST_LAYOUT)).toEqual(
            expectedState
        )
    })
})
