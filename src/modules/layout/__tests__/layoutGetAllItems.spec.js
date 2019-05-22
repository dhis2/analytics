import { layoutGetAllItems } from '../layoutGetAllItems'
import { TEST_LAYOUT, TEST_ITEMS_IN_LAYOUT } from '../testResources'

describe('layoutGetAllItems', () => {
    it('should return all items in the layout', () => {
        expect(layoutGetAllItems(TEST_LAYOUT)).toEqual(TEST_ITEMS_IN_LAYOUT)
    })
})
