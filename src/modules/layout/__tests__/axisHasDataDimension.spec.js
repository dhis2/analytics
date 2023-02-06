import { axisHasDataDimension } from '../axisHasDataDimension.js'
import { TEST_AXIS_COLUMNS, TEST_AXIS_ROWS } from '../testResources.js'

describe('axisHasDataDimension', () => {
    it('should return true if the dimension is found in the axis', () => {
        expect(axisHasDataDimension(TEST_AXIS_COLUMNS)).toBe(true)

        expect(axisHasDataDimension(TEST_AXIS_ROWS)).toBe(false)
    })
})
