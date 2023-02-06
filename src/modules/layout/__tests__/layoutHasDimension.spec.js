import { DIMENSION_ID_ORGUNIT } from '../../predefinedDimensions.js'
import { AXIS, AXIS_ID_FILTERS } from '../axis.js'
import { layoutHasDimension } from '../layoutHasDimension.js'
import { TEST_LAYOUT } from '../testResources.js'

describe('layoutHasDimension', () => {
    it('should return true if the dimension id is found in the layout, otherwise false', () => {
        expect(layoutHasDimension(TEST_LAYOUT, DIMENSION_ID_ORGUNIT)).toBe(true)

        const layoutWithoutPeriod = {
            ...TEST_LAYOUT,
            [AXIS_ID_FILTERS]: AXIS.defaultValue,
        }

        expect(
            layoutHasDimension(layoutWithoutPeriod, DIMENSION_ID_ORGUNIT)
        ).toBe(false)
    })
})
