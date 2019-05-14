import { AXIS, AXIS_NAME_FILTERS } from '../axis'
import { layoutHasDynamicDimension } from '../layoutHasDynamicDimension'
import { TEST_LAYOUT } from '../testResources'

describe('layoutHasDynamicDimension', () => {
    it('should return true if a dynamic dimension id is found in the layout, otherwise false', () => {
        expect(layoutHasDynamicDimension(TEST_LAYOUT)).toBe(true)

        const layoutWithoutDynamicDimension = {
            ...TEST_LAYOUT,
            [AXIS_NAME_FILTERS]: AXIS.defaultValue,
        }

        expect(layoutHasDynamicDimension(layoutWithoutDynamicDimension)).toBe(
            false
        )
    })
})
