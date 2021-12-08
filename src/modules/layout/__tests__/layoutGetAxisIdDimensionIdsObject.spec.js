import { AXIS_ID_COLUMNS, AXIS_ID_ROWS, AXIS_ID_FILTERS } from '../axis.js'
import { DIMENSION_PROP_ID } from '../dimension.js'
import { layoutGetAxisIdDimensionIdsObject } from '../layoutGetAxisIdDimensionIdsObject.js'
import {
    TEST_LAYOUT,
    TEST_AXIS_COLUMNS,
    TEST_AXIS_ROWS,
    TEST_AXIS_FILTERS,
} from '../testResources.js'

describe('layoutGetAxisIdDimensionIdsObject', () => {
    it('should return an axisId:[dimensionIds] object based on the layout', () => {
        const expectedState = {
            [AXIS_ID_COLUMNS]: TEST_AXIS_COLUMNS.map(
                (dimension) => dimension[DIMENSION_PROP_ID.name]
            ),
            [AXIS_ID_ROWS]: TEST_AXIS_ROWS.map(
                (dimension) => dimension[DIMENSION_PROP_ID.name]
            ),
            [AXIS_ID_FILTERS]: TEST_AXIS_FILTERS.map(
                (dimension) => dimension[DIMENSION_PROP_ID.name]
            ),
        }

        expect(layoutGetAxisIdDimensionIdsObject(TEST_LAYOUT)).toEqual(
            expectedState
        )
    })
})
