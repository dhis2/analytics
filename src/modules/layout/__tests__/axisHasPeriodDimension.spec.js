import { axisHasPeriodDimension } from '../axisHasPeriodDimension.js'
import { TEST_AXIS_COLUMNS, TEST_AXIS_ROWS } from '../testResources.js'

describe('axisHasPeriodDimension', () => {
    it('should return true if the dimension is found in the axis', () => {
        expect(axisHasPeriodDimension(TEST_AXIS_COLUMNS)).toBe(false)

        expect(axisHasPeriodDimension(TEST_AXIS_ROWS)).toBe(true)
    })
})
