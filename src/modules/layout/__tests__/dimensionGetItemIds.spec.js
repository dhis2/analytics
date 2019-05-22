import { dimensionGetItemIds } from '../dimensionGetItemIds'
import { TEST_DIMENSION_1 } from '../testResources'
import { DIMENSION_PROP_ITEMS } from '../dimension'
import { ITEM_PROP_ID } from '../item'

describe('dimensionGetItemIds', () => {
    it('should return the item ids in the dimension', () => {
        expect(dimensionGetItemIds(TEST_DIMENSION_1)).toEqual(
            TEST_DIMENSION_1[DIMENSION_PROP_ITEMS.name].map(
                item => item[ITEM_PROP_ID.name]
            )
        )
    })
})
