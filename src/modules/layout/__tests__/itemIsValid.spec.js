import { itemIsValid } from '../itemIsValid'
import { TEST_ITEM_1 } from '../item'
import { TEST_ITEM_ID_1 } from '.'

describe('itemIsValid', () => {
    it('should return true', () => {
        expect(itemIsValid(TEST_ITEM_1)).toBe(true)
    })

    it('should return false', () => {
        expect(itemIsValid(TEST_ITEM_INVALID_1)).toBe(false)
    })

    it('should return false', () => {
        expect(itemIsValid(TEST_ITEM_INVALID_2)).toBe(false)
    })
})
