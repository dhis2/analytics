import { TEST_AXIS_COLUMNS, TEST_AXIS_EMPTY } from '../testResources'
import { axisIsEmpty } from '../axisIsEmpty'

describe('axisIsEmpty', () => {
    it('should return true if the axis has no dimensions', () => {
        expect(axisIsEmpty(TEST_AXIS_COLUMNS)).toBe(false)

        expect(axisIsEmpty(TEST_AXIS_EMPTY)).toBe(true)
    })
})
