import { axisGetDimension } from '../axisGetDimension'
import { TEST_AXIS_COLUMNS, TEST_AXIS_ROWS } from '../testResources'
import { dimensionGetId } from '../dimensionGetId'

describe('axisGetDimension', () => {
    it('should return the dimension specified by id', () => {
        const columnDimension = TEST_AXIS_COLUMNS[0]
        const rowDimension = TEST_AXIS_ROWS[0]

        expect(
            axisGetDimension(TEST_AXIS_COLUMNS, dimensionGetId(columnDimension))
        ).toEqual(columnDimension)

        expect(
            axisGetDimension(TEST_AXIS_COLUMNS, dimensionGetId(rowDimension))
        ).not.toEqual(columnDimension)
    })
})
