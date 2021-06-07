import { AXIS, AXIS_ID_ROWS } from '../axis'
import { layoutHasPeriodDimension } from '../layoutHasPeriodDimension'
import { TEST_LAYOUT } from '../testResources'

describe('layoutHasPeriodDimension', () => {
    it('should return true if the pe dimension is found in the layout, otherwise false', () => {
        expect(layoutHasPeriodDimension(TEST_LAYOUT)).toBe(true)

        const layoutWithoutPeriod = {
            ...TEST_LAYOUT,
            [AXIS_ID_ROWS]: AXIS.defaultValue,
        }

        expect(layoutHasPeriodDimension(layoutWithoutPeriod)).toBe(false)
    })
})
