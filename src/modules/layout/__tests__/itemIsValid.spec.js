import { itemIsValid } from '../itemIsValid.js'
import {
    TEST_ITEM_1,
    TEST_ITEM_INVALID_1,
    TEST_ITEM_INVALID_2,
} from '../testResources.js'

describe('itemIsValid', () => {
    it('should return true if valid, otherwise false', () => {
        expect(itemIsValid(TEST_ITEM_1)).toBe(true)
        expect(itemIsValid(TEST_ITEM_INVALID_1)).toBe(false)
        expect(itemIsValid(TEST_ITEM_INVALID_2)).toBe(false)
    })
})
