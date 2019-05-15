import { axisGetDimensionIds } from '../axisGetDimensionIds'
import { TEST_AXIS_1, TEST_DIMENSIONS_IN_AXIS_1 } from '../testResources'
import { DIMENSION_PROP_ID } from '../dimension'

describe('axisGetDimensionIds', () => {
    it('should return the id of the dimensions in the axis', () => {
        expect(axisGetDimensionIds(TEST_AXIS_1)).toEqual(
            TEST_DIMENSIONS_IN_AXIS_1.map(item => item[DIMENSION_PROP_ID.name])
        )
    })
})
