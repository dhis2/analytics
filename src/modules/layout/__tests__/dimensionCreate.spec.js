import { DIMENSION_PROP_ID, DIMENSION_PROP_ITEMS } from '../dimension.js'
import { dimensionCreate } from '../dimensionCreate.js'
import { TEST_DIMENSION_1 } from '../testResources.js'

describe('dimensionCreate', () => {
    it('should return the created dimension', () => {
        const dimensionId = TEST_DIMENSION_1[DIMENSION_PROP_ID.name]
        const itemIds = TEST_DIMENSION_1[DIMENSION_PROP_ITEMS.name].map(
            item => item.id
        )

        expect(dimensionCreate(dimensionId, itemIds)).toEqual(TEST_DIMENSION_1)
    })
})
