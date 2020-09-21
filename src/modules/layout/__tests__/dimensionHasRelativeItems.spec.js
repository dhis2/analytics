import { TEST_DIMENSION_1, TEST_DIMENSION_5 } from '../testResources'
import { dimensionHasRelativeItems } from '../dimensionHasRelativeItems'

describe('dimensionHasRelativeItems', () => {
    it('has relative items and should return true', () => {
        expect(dimensionHasRelativeItems(TEST_DIMENSION_5)).toBe(true)
    })

    it('has no relative items and should return false', () => {
        expect(dimensionHasRelativeItems(TEST_DIMENSION_1)).toBe(false)
    })
})
