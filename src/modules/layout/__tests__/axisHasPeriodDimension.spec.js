import { TEST_AXIS_1, TEST_AXIS_2 } from '../testResources'
import { axisHasPeriodDimension } from '../axisHasPeriodDimension'

describe('axisHasPeriodDimension', () => {
    it('should return true if the dimension is found in the axis', () => {
        expect(axisHasPeriodDimension(TEST_AXIS_1)).toBe(false)

        expect(axisHasPeriodDimension(TEST_AXIS_2)).toBe(true)
    })
})
