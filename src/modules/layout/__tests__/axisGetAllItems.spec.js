import { axisGetAllItems } from '../axisGetAllItems'
import {
    TEST_AXIS_COLUMNS,
    TEST_ITEMS_IN_AXIS_1,
    TEST_ITEMS_IN_AXIS_2,
} from '../testResources'

describe('axisGetAllItems', () => {
    it('should return all items in all dimensions in the axis', () => {
        expect(axisGetAllItems(TEST_AXIS_COLUMNS)).toEqual(TEST_ITEMS_IN_AXIS_1)

        expect(axisGetAllItems(TEST_AXIS_COLUMNS)).not.toEqual(
            TEST_ITEMS_IN_AXIS_2
        )
    })
})
