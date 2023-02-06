import { dimensionIsValid } from '../dimensionIsValid.js'
import {
    TEST_DIMENSION_1,
    TEST_DIMENSION_INVALID_ID_1,
    TEST_DIMENSION_INVALID_ID_2,
    TEST_DIMENSION_INVALID_ITEMS_1,
} from '../testResources.js'

describe('dimensionIsValid', () => {
    it('should return true if required props are valid, otherwise false', () => {
        expect(dimensionIsValid(TEST_DIMENSION_1)).toBe(true)
        expect(dimensionIsValid(TEST_DIMENSION_INVALID_ID_1)).toBe(false)
        expect(dimensionIsValid(TEST_DIMENSION_INVALID_ID_2)).toBe(false)
    })

    it('should return true if all props are valid, otherwise false', () => {
        expect(dimensionIsValid(TEST_DIMENSION_1, { requireItems: true })).toBe(
            true
        )
        expect(
            dimensionIsValid(TEST_DIMENSION_INVALID_ITEMS_1, {
                requireItems: true,
            })
        ).toBe(false)
    })
})
