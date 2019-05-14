import { TEST_LAYOUT } from '../testResources'
import { AXIS, AXIS_NAME_ROWS } from '../axis'
import { layoutHasPeriodDimension } from '../layoutHasPeriodDimension'

describe('layoutHasPeriodDimension', () => {
    it('should return true if the pe dimension is found in the layout, otherwise false', () => {
        expect(layoutHasPeriodDimension(TEST_LAYOUT)).toBe(true)

        const layoutWithoutPeriod = {
            ...TEST_LAYOUT,
            [AXIS_NAME_ROWS]: AXIS.defaultValue,
        }

        expect(layoutHasPeriodDimension(layoutWithoutPeriod)).toBe(false)
    })
})
