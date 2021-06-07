import { axisHasPeriodDimension } from '../axisHasPeriodDimension'
import { TEST_AXIS_COLUMNS, TEST_AXIS_ROWS } from '../testResources'

describe('axisHasPeriodDimension', () => {
    it('should return true if the dimension is found in the axis', () => {
        expect(axisHasPeriodDimension(TEST_AXIS_COLUMNS)).toBe(false)

        expect(axisHasPeriodDimension(TEST_AXIS_ROWS)).toBe(true)
    })
})
