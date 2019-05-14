import { axisGetAllItems } from '../axisGetAllItems'
import {
    TEST_AXIS_1,
    TEST_ITEMS_IN_AXIS_1,
    TEST_ITEMS_IN_AXIS_2,
} from '../testResources'

describe('axisGetAllItems', () => {
    it('should return all items in all dimensions in the axis', () => {
        expect(axisGetAllItems(TEST_AXIS_1)).toEqual(TEST_ITEMS_IN_AXIS_1)

        expect(axisGetAllItems(TEST_AXIS_1)).not.toEqual(TEST_ITEMS_IN_AXIS_2)
    })
})
