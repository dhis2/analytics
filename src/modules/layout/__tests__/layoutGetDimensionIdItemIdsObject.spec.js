import { layoutGetDimensionIdItemIdsObject } from '../layoutGetDimensionIdItemIdsObject'
import { DIMENSION_PROP_ID, DIMENSION_PROP_ITEMS } from '../dimension'
import { ITEM_PROP_ID } from '../item'
import { TEST_LAYOUT, TEST_DIMENSIONS_IN_LAYOUT } from '../testResources'

const getDimensionId = dim => dim[DIMENSION_PROP_ID.name]
const getItemIds = dim =>
    dim[DIMENSION_PROP_ITEMS.name].map(item => item[ITEM_PROP_ID.name])

describe('layoutGetDimensionIdItemIdsObject', () => {
    it('should return a dimensionId:itemdIds object based on the layout', () => {
        const expectedState = {}

        TEST_DIMENSIONS_IN_LAYOUT.forEach(dimension => {
            expectedState[getDimensionId(dimension)] = getItemIds(dimension)
        })

        expect(layoutGetDimensionIdItemIdsObject(TEST_LAYOUT)).toEqual(
            expectedState
        )
    })
})
