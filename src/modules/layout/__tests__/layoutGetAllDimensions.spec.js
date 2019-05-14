import { layoutGetAllDimensions } from '../layoutGetAllDimensions'
import { TEST_LAYOUT, TEST_DIMENSIONS_IN_LAYOUT } from '../testResources'

describe('layoutGetAllDimensions', () => {
    it('should return all dimensions in the layout', () => {
        expect(layoutGetAllDimensions(TEST_LAYOUT)).toEqual(
            TEST_DIMENSIONS_IN_LAYOUT
        )
    })
})
