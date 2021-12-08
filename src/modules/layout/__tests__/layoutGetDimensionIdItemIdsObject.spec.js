import { DIMENSION_PROP_ID, DIMENSION_PROP_ITEMS } from '../dimension.js'
import { ITEM_PROP_ID } from '../item.js'
import { layoutGetDimensionIdItemIdsObject } from '../layoutGetDimensionIdItemIdsObject.js'
import { TEST_LAYOUT, TEST_DIMENSIONS_IN_LAYOUT } from '../testResources.js'

describe('layoutGetDimensionIdItemIdsObject', () => {
    it('should return a dimensionId:[itemdIds] object based on the layout', () => {
        const expectedState = {}

        TEST_DIMENSIONS_IN_LAYOUT.forEach((dimension) => {
            expectedState[dimension[DIMENSION_PROP_ID.name]] = dimension[
                DIMENSION_PROP_ITEMS.name
            ].map((item) => item[ITEM_PROP_ID.name])
        })

        expect(layoutGetDimensionIdItemIdsObject(TEST_LAYOUT)).toEqual(
            expectedState
        )
    })
})
