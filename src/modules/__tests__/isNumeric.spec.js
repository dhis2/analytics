import { isNumeric } from '../utils.js'

describe('isNumeric', () => {
    it('should return true for a number string', () => {
        expect(isNumeric('01')).toBe(true)
    })

    it('should return true for a regular number', () => {
        expect(isNumeric(10)).toBe(true)
    })

    it('should not regard infinity as a numeric', () => {
        expect(isNumeric(Infinity)).toBe(false)
        expect(isNumeric(-Infinity)).toBe(false)
    })

    it('should return false for NaN', () => {
        expect(isNumeric(NaN)).toBe(false)
    })

    it('should return false for things other than numbers', () => {
        expect(isNumeric(null)).toBe(false)
        expect(isNumeric([1, 2, 3])).toBe(false)
        expect(isNumeric(true)).toBe(false)
        expect(isNumeric(new Date())).toBe(false)
        expect(isNumeric(new Error())).toBe(false)
        expect(isNumeric(undefined)).toBe(false)
        expect(isNumeric(() => {})).toBe(false)
        expect(isNumeric({ a: 1 })).toBe(false)
        expect(isNumeric(/x/)).toBe(false)
        expect(isNumeric('a')).toBe(false)
        expect(isNumeric(Symbol())).toBe(false)
    })
})
