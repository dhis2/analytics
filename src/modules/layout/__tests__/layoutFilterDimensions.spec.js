import { layoutFilterDimensions } from '../layoutFilterDimensions'
import { DIMENSION_PROP_ID } from '../dimension'
import { AXIS, AXIS_NAME_FILTERS } from '../axis'
import { TEST_LAYOUT } from '../testResources'

describe('layoutFilterDimensions', () => {
    it('should return a copy of the layout without the specified dimensions', () => {
        const idsToFilter = TEST_LAYOUT[AXIS_NAME_FILTERS].map(
            dimension => dimension[DIMENSION_PROP_ID.name]
        )

        const actualState = layoutFilterDimensions(TEST_LAYOUT, idsToFilter)

        const expectedState = Object.assign({}, TEST_LAYOUT, {
            [AXIS_NAME_FILTERS]: AXIS.defaultValue,
        })

        expect(actualState).toEqual(expectedState)
    })
})
