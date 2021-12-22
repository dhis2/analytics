import { ITEM_PROP_ID } from '../item.js'
import { layoutGetAllItemIds } from '../layoutGetAllItemIds.js'
import { TEST_LAYOUT, TEST_ITEMS_IN_LAYOUT } from '../testResources.js'

describe('layoutGetAllItemIds', () => {
    it('should return all item ids in the layout', () => {
        expect(layoutGetAllItemIds(TEST_LAYOUT)).toEqual(
            TEST_ITEMS_IN_LAYOUT.map(item => item[ITEM_PROP_ID.name])
        )
    })
})
