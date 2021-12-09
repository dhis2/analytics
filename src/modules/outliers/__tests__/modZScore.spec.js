import {
    getMean,
    getMeanAbsoluteDeviation,
    getMedian,
    getMedianAbsoluteDeviation,
} from '../modZScore.js'

const a4 = [1, 2, 3, 10]
const a5 = [1, 2, 3, 10, 20]

describe('Helper functions', () => {
    test('getMean', () => {
        expect(getMean(a4)).toBe(4)
        expect(getMean(a5)).toBe(7.2)
    })

    test('getMedian', () => {
        expect(getMedian(a4)).toBe(2.5)
        expect(getMedian(a5)).toBe(3)
    })

    test('getMedianAbsoluteDeviation', () => {
        expect(getMedianAbsoluteDeviation(a4)).toBe(1)
        expect(getMedianAbsoluteDeviation(a5)).toBe(2)
    })

    test('getMeanAbsoluteDeviation', () => {
        expect(getMeanAbsoluteDeviation(a4)).toBe(3)
        expect(getMeanAbsoluteDeviation(a5)).toBe(6.24)
    })
})
