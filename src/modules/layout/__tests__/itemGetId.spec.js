import { ITEM_PROP_ID } from '../item'
import { itemGetId } from '../itemGetId'
import { TEST_ITEM_1, TEST_ITEM_ID_1 } from '../testResources'

describe('itemGetId', () => {
    it('should return the item id', () => {
        expect(itemGetId(TEST_ITEM_1)).toBe(TEST_ITEM_ID_1)
    })

    it('should return the default value', () => {
        expect(itemGetId('Not an item')).toBe(ITEM_PROP_ID.defaultValue)
    })
})
