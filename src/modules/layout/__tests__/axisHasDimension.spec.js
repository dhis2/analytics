import { axisHasDimension } from '../axisHasDimension.js'
import { DIMENSION_PROP_ID } from '../dimension.js'
import { TEST_AXIS_COLUMNS, TEST_AXIS_ROWS } from '../testResources.js'

describe('axisHasDimension', () => {
    it('should return true if the dimension is found in the axis, otherwise false', () => {
        expect(
            axisHasDimension(
                TEST_AXIS_COLUMNS,
                TEST_AXIS_COLUMNS[0][DIMENSION_PROP_ID.name]
            )
        ).toBe(true)

        expect(
            axisHasDimension(
                TEST_AXIS_COLUMNS,
                TEST_AXIS_ROWS[0][DIMENSION_PROP_ID.name]
            )
        ).toBe(false)
    })
})
