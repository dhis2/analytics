import { AXIS } from '../axis'
import { axisGetDimensionIds } from '../axisGetDimensionIds'
import { DIMENSION_PROP_ID } from '../dimension'
import { TEST_AXIS_COLUMNS, TEST_AXIS_ROWS } from '../testResources'

describe('axisGetDimensionIds', () => {
    it('should return the id of the dimensions in the axis', () => {
        const columnDimIds = TEST_AXIS_COLUMNS.map(
            (item) => item[DIMENSION_PROP_ID.name]
        )

        expect(axisGetDimensionIds(TEST_AXIS_COLUMNS)).toEqual(columnDimIds)

        expect(axisGetDimensionIds(TEST_AXIS_ROWS)).not.toEqual(columnDimIds)
    })

    it('should return the default value', () => {
        expect(axisGetDimensionIds('Not an axis')).toEqual(AXIS.defaultValue)
    })
})
