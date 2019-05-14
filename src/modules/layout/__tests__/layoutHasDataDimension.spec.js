import { TEST_LAYOUT } from '../testResources'
import { AXIS, AXIS_NAME_COLUMNS } from '../axis'
import { layoutHasDataDimension } from '../layoutHasDataDimension'

describe('layoutHasDataDimension', () => {
    it('should return true if the dx dimension is found in the layout, otherwise false', () => {
        expect(layoutHasDataDimension(TEST_LAYOUT)).toBe(true)

        const layoutWithoutData = {
            ...TEST_LAYOUT,
            [AXIS_NAME_COLUMNS]: AXIS.defaultValue,
        }

        expect(layoutHasDataDimension(layoutWithoutData)).toBe(false)
    })
})
