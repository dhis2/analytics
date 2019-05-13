import { itemGetId } from '../itemGetId'
import { TEST_ITEM_1 } from '../item'
import { TEST_ITEM_ID_1 } from '.'

describe('itemGetId', () => {
    it('should return the item id', () => {
        expect(itemGetId(TEST_ITEM_1)).toBe(TEST_ITEM_ID_1)
    })
})
