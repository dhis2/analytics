import { AXIS, AXIS_ID_COLUMNS } from '../axis'
import { layoutHasDataDimension } from '../layoutHasDataDimension'
import { TEST_LAYOUT } from '../testResources'

describe('layoutHasDataDimension', () => {
    it('should return true if the dx dimension is found in the layout, otherwise false', () => {
        expect(layoutHasDataDimension(TEST_LAYOUT)).toBe(true)

        const layoutWithoutData = {
            ...TEST_LAYOUT,
            [AXIS_ID_COLUMNS]: AXIS.defaultValue,
        }

        expect(layoutHasDataDimension(layoutWithoutData)).toBe(false)
    })
})
