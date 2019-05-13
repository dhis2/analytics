import { TEST_DIMENSION_1 } from '.'
import { DIMENSION_PROP_ID, DIMENSION_PROP_ITEMS } from '../dimension'

describe('dimensionCreate', () => {
    it('should return the created dimension', () => {
        const dimensionId = TEST_DIMENSION_1[DIMENSION_PROP_ID.name]
        const itemIds = TEST_DIMENSION_1[DIMENSION_PROP_ITEMS.name]

        expect(dimensionCreate(dimensionId, itemIds)).toBe(TEST_DIMENSION_1)
    })
})
