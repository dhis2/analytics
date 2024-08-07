import { axisHasOuDimension } from '../axisHasOuDimension.js'
import { TEST_AXIS_COLUMNS, TEST_AXIS_FILTERS } from '../testResources.js'

describe('axisHasOuDimension', () => {
    it('should return true if the ou dimension is found in the axis', () => {
        expect(axisHasOuDimension(TEST_AXIS_COLUMNS)).toBe(false)

        expect(axisHasOuDimension(TEST_AXIS_FILTERS)).toBe(true)
    })
})
