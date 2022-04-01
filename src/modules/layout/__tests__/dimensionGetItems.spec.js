import { DIMENSION_PROP_ITEMS } from '../dimension.js'
import { dimensionGetItems } from '../dimensionGetItems.js'
import { TEST_DIMENSION_1 } from '../testResources.js'

describe('dimensionGetItems', () => {
    it('should return the items in the dimension', () => {
        expect(dimensionGetItems(TEST_DIMENSION_1)).toEqual(
            TEST_DIMENSION_1[DIMENSION_PROP_ITEMS.name]
        )
    })

    it('should return the default value', () => {
        expect(dimensionGetItems('Not a dimension')).toEqual(
            DIMENSION_PROP_ITEMS.defaultValue
        )
    })
})
