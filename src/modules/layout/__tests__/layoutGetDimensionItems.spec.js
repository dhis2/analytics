import { DIMENSION_PROP_ID, DIMENSION_PROP_ITEMS } from '../dimension.js'
import { layoutGetDimensionItems } from '../layoutGetDimensionItems.js'
import { TEST_LAYOUT, TEST_DIMENSION_1 } from '../testResources.js'

describe('layoutGetDimensionItems', () => {
    it('should return an array of items', () => {
        expect(
            layoutGetDimensionItems(
                TEST_LAYOUT,
                TEST_DIMENSION_1[DIMENSION_PROP_ID.name]
            )
        ).toEqual(TEST_DIMENSION_1[DIMENSION_PROP_ITEMS.name])
    })

    it('should return empty array as the dimension is not found', () => {
        expect(layoutGetDimensionItems(TEST_LAYOUT, 'nonExistingId')).toEqual(
            []
        )
    })
})
