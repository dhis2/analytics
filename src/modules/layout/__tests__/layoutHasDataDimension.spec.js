import { AXIS, AXIS_ID_COLUMNS } from '../axis.js'
import { layoutHasDataDimension } from '../layoutHasDataDimension.js'
import { TEST_LAYOUT } from '../testResources.js'

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
