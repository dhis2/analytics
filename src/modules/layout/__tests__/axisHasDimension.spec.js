import { axisHasDimension } from '../axisHasDimension'
import { TEST_AXIS_1, TEST_AXIS_2 } from '../testResources'
import { DIMENSION_PROP_ID } from '../dimension'

describe('axisHasDimension', () => {
    it('should return true if the dimension is found in the axis', () => {
        expect(
            axisHasDimension(
                TEST_AXIS_1,
                TEST_AXIS_1[0][DIMENSION_PROP_ID.name]
            )
        ).toBe(true)

        expect(
            axisHasDimension(
                TEST_AXIS_1,
                TEST_AXIS_2[0][DIMENSION_PROP_ID.name]
            )
        ).toBe(false)
    })
})
