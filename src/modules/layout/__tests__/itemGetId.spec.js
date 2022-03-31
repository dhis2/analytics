import { ITEM_PROP_ID } from '../item.js'
import { itemGetId } from '../itemGetId.js'
import { TEST_ITEM_1, TEST_ITEM_ID_1 } from '../testResources.js'

describe('itemGetId', () => {
    it('should return the item id', () => {
        expect(itemGetId(TEST_ITEM_1)).toBe(TEST_ITEM_ID_1)
    })

    it('should return the default value', () => {
        expect(itemGetId('Not an item')).toBe(ITEM_PROP_ID.defaultValue)
    })
})
