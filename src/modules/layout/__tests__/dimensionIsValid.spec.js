import { dimensionIsValid } from '../dimensionIsValid'
import {
    TEST_DIMENSION_1,
    TEST_DIMENSION_INVALID_1,
    TEST_DIMENSION_INVALID_2,
} from '../testResources'

describe('dimensionIsValid', () => {
    it('should return true if valid, otherwise false', () => {
        expect(dimensionIsValid(TEST_DIMENSION_1)).toBe(true)
        expect(dimensionIsValid(TEST_DIMENSION_INVALID_1)).toBe(false)
        expect(dimensionIsValid(TEST_DIMENSION_INVALID_2)).toBe(false)
    })
})
