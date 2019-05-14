import { TEST_LAYOUT } from '../testResources'
import { AXIS, AXIS_NAME_ROWS } from '../axis'
import { layoutHasDimension } from '../layoutHasDimension'
import { DIMENSION_ID_PERIOD } from '../../fixedDimensions'

describe('layoutHasDimension', () => {
    it('should return true if the dimension id is found in the layout, otherwise false', () => {
        expect(layoutHasDimension(TEST_LAYOUT, DIMENSION_ID_PERIOD)).toBe(true)

        const layoutWithoutPeriod = {
            ...TEST_LAYOUT,
            [AXIS_NAME_ROWS]: AXIS.defaultValue,
        }

        expect(
            layoutHasDimension(layoutWithoutPeriod, DIMENSION_ID_PERIOD)
        ).toBe(false)
    })
})
