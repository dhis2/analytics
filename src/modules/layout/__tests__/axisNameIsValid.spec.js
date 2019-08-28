import { axisNameIsValid } from '../axisNameIsValid'
import { AXIS_NAME_COLUMNS, AXIS_NAME_ROWS, AXIS_NAME_FILTERS } from '../axis'

describe('axisNameIsValid', () => {
    it('should return true if the axis name is valid', () => {
        expect(axisNameIsValid(AXIS_NAME_COLUMNS)).toBe(true)
        expect(axisNameIsValid(AXIS_NAME_ROWS)).toBe(true)
        expect(axisNameIsValid(AXIS_NAME_FILTERS)).toBe(true)
    })

    it('should return false if the axis name is invalid', () => {
        expect(axisNameIsValid('totally invalid axis name')).toBe(false)
    })
})
