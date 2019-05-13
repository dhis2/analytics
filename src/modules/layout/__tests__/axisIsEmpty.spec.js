import { TEST_AXIS_1, TEST_AXIS_EMPTY_1 } from '../testResources'
import { axisIsEmpty } from '../axisIsEmpty'

describe('axisIsEmpty', () => {
    it('should return true if the axis has no dimensions', () => {
        expect(axisIsEmpty(TEST_AXIS_1)).toBe(false)

        expect(axisIsEmpty(TEST_AXIS_EMPTY_1)).toBe(true)
    })
})
