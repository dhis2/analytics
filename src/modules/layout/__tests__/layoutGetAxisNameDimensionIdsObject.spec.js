import { layoutGetAxisNameDimensionIdsObject } from '../layoutGetAxisNameDimensionIdsObject'
import { AXIS_NAME_COLUMNS, AXIS_NAME_ROWS, AXIS_NAME_FILTERS } from '../axis'
import {
    TEST_LAYOUT,
    TEST_AXIS_COLUMNS,
    TEST_AXIS_ROWS,
    TEST_AXIS_FILTERS,
} from '../testResources'
import { DIMENSION_PROP_ID } from '../dimension'

describe('layoutGetAxisNameDimensionIdsObject', () => {
    it('should return an axisName:[dimensionIds] object based on the layout', () => {
        const expectedState = {
            [AXIS_NAME_COLUMNS]: TEST_AXIS_COLUMNS.map(
                dimension => dimension[DIMENSION_PROP_ID.name]
            ),
            [AXIS_NAME_ROWS]: TEST_AXIS_ROWS.map(
                dimension => dimension[DIMENSION_PROP_ID.name]
            ),
            [AXIS_NAME_FILTERS]: TEST_AXIS_FILTERS.map(
                dimension => dimension[DIMENSION_PROP_ID.name]
            ),
        }

        expect(layoutGetAxisNameDimensionIdsObject(TEST_LAYOUT)).toEqual(
            expectedState
        )
    })
})
