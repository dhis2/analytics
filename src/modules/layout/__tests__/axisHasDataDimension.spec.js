import { TEST_AXIS_1, TEST_AXIS_2 } from '../testResources'
import { axisHasDataDimension } from '../axisHasDataDimension'

describe('axisHasDataDimension', () => {
    it('should return true if the dimension is found in the axis', () => {
        expect(axisHasDataDimension(TEST_AXIS_1)).toBe(true)

        expect(axisHasDataDimension(TEST_AXIS_2)).toBe(false)
    })
})
