import { dimensionGetId } from '../dimensionGetId'
import { DIMENSION_PROP_ID } from '../dimension'
import { TEST_DIMENSION_1 } from '../testResources'

describe('dimensionGetId', () => {
    it('should return the dimension id', () => {
        expect(dimensionGetId(TEST_DIMENSION_1)).toBe(
            TEST_DIMENSION_1[DIMENSION_PROP_ID.name]
        )
    })
})
