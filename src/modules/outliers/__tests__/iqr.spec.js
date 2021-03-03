import { getQuartilePosition, getQuartileValue } from '../iqr'

const a3 = [2, 4, 5]
const a4 = [2, 4, 5, 7]
const a5 = [2, 4, 5, 7, 15]
const a6 = [2, 4, 5, 7, 15, 40]

describe('getQuartilePosition', () => {
    describe('first quartile position', () => {
        test('no skew', () => {
            expect(getQuartilePosition(a3, 0.25)).toBe(1)
        })
        test('.25 skew', () => {
            expect(getQuartilePosition(a4, 0.25)).toBe(1.25)
        })
        test('.50 skew', () => {
            expect(getQuartilePosition(a5, 0.25)).toBe(1.5)
        })
        test('.75 skew', () => {
            expect(getQuartilePosition(a6, 0.25)).toBe(1.75)
        })
    })

    describe('second quartile position', () => {
        test('no skew', () => {
            expect(getQuartilePosition(a3, 0.5)).toBe(2)
        })
        test('.25 skew', () => {
            expect(getQuartilePosition(a4, 0.5)).toBe(2.5)
        })
        test('.50 skew', () => {
            expect(getQuartilePosition(a5, 0.5)).toBe(3)
        })
        test('.75 skew', () => {
            expect(getQuartilePosition(a6, 0.5)).toBe(3.5)
        })
    })

    describe('third quartile position', () => {
        test('no skew', () => {
            expect(getQuartilePosition(a3, 0.75)).toBe(3)
        })
        test('.25 skew', () => {
            expect(getQuartilePosition(a4, 0.75)).toBe(3.75)
        })
        test('.50 skew', () => {
            expect(getQuartilePosition(a5, 0.75)).toBe(4.5)
        })
        test('.75 skew', () => {
            expect(getQuartilePosition(a6, 0.75)).toBe(5.25)
        })
    })
})

describe('getQuartileValue', () => {
    describe('first quartile value', () => {
        test('no skew', () => {
            expect(getQuartileValue(a3, 0.25)).toBe(2)
        })
        test('.25 skew', () => {
            expect(getQuartileValue(a4, 0.25)).toBe(2.5)
        })
        test('.50 skew', () => {
            expect(getQuartileValue(a5, 0.25)).toBe(3)
        })
        test('.75 skew', () => {
            expect(getQuartileValue(a6, 0.25)).toBe(3.5)
        })
    })

    describe('second quartile value', () => {
        test('no skew', () => {
            expect(getQuartileValue(a3, 0.5)).toBe(4)
        })
        test('.25 skew', () => {
            expect(getQuartileValue(a4, 0.5)).toBe(4.5)
        })
        test('.50 skew', () => {
            expect(getQuartileValue(a5, 0.5)).toBe(5)
        })
        test('.75 skew', () => {
            expect(getQuartileValue(a6, 0.5)).toBe(6)
        })
    })

    describe('third quartile value', () => {
        test('no skew', () => {
            expect(getQuartileValue(a3, 0.75)).toBe(5)
        })
        test('.25 skew', () => {
            expect(getQuartileValue(a4, 0.75)).toBe(6.5)
        })
        test('.50 skew', () => {
            expect(getQuartileValue(a5, 0.75)).toBe(11)
        })
        test('.75 skew', () => {
            expect(getQuartileValue(a6, 0.75)).toBe(21.25)
        })
    })
})
