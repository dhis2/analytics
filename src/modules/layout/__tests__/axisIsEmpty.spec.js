import { axisIsEmpty } from '../axisIsEmpty.js'
import { TEST_AXIS_COLUMNS, TEST_AXIS_EMPTY } from '../testResources.js'

describe('axisIsEmpty', () => {
    it('should return true if the axis has no dimensions, otherwise false', () => {
        expect(axisIsEmpty(TEST_AXIS_COLUMNS)).toBe(false)

        expect(axisIsEmpty(TEST_AXIS_EMPTY)).toBe(true)
    })
})
