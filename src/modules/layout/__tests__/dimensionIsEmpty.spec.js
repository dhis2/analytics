import { dimensionIsEmpty } from '../dimensionIsEmpty.js'
import { TEST_DIMENSION_1, TEST_DIMENSION_EMPTY_1 } from '../testResources.js'

describe('dimensionIsEmpty', () => {
    it('should return true if the dimension has no items', () => {
        expect(dimensionIsEmpty(TEST_DIMENSION_1)).toEqual(false)

        expect(dimensionIsEmpty(TEST_DIMENSION_EMPTY_1)).toEqual(true)
    })
})
