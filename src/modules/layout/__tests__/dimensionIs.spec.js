import { DIMENSION_PROP_ID } from '../dimension.js'
import { dimensionIs } from '../dimensionIs.js'
import { TEST_DIMENSION_1, TEST_DIMENSION_2 } from '../testResources.js'

describe('dimensionIs', () => {
    it('should return true if it is the specified dimension, otherwise false', () => {
        expect(
            dimensionIs(
                TEST_DIMENSION_1,
                TEST_DIMENSION_1[DIMENSION_PROP_ID.name]
            )
        ).toBe(true)

        expect(
            dimensionIs(
                TEST_DIMENSION_2,
                TEST_DIMENSION_1[DIMENSION_PROP_ID.name]
            )
        ).toBe(false)
    })
})
