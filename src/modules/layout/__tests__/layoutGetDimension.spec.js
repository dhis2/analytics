import { layoutGetDimension } from '../layoutGetDimension'
import { DIMENSION_PROP_ID } from '../dimension'
import { TEST_LAYOUT, TEST_DIMENSION_1 } from '../testResources'

describe('layoutGetDimension', () => {
    it('should return true if the dimension id is found in the layout, otherwise false', () => {
        expect(
            layoutGetDimension(
                TEST_LAYOUT,
                TEST_DIMENSION_1[DIMENSION_PROP_ID.name]
            )
        ).toEqual(TEST_DIMENSION_1)
    })
})
