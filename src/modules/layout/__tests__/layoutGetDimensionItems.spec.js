import { layoutGetDimensionItems } from '../layoutGetDimensionItems'
import { DIMENSION_PROP_ID, DIMENSION_PROP_ITEMS } from '../dimension'
import { TEST_LAYOUT, TEST_DIMENSION_1 } from '../testResources'

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
