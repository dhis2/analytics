import { AXIS, AXIS_ID_FILTERS } from '../axis'
import { DIMENSION_PROP_ID } from '../dimension'
import { layoutFilterDimensions } from '../layoutFilterDimensions'
import { TEST_LAYOUT } from '../testResources'

describe('layoutFilterDimensions', () => {
    it('should return a copy of the layout without the specified dimensions', () => {
        const idsToFilter = TEST_LAYOUT[AXIS_ID_FILTERS].map(
            dimension => dimension[DIMENSION_PROP_ID.name]
        )

        const actualState = layoutFilterDimensions(TEST_LAYOUT, idsToFilter)

        const expectedState = Object.assign({}, TEST_LAYOUT, {
            [AXIS_ID_FILTERS]: AXIS.defaultValue,
        })

        expect(actualState).toEqual(expectedState)
    })
})
