import { getOutlierHelper } from '..'
import {
    getMean,
    getMeanAbsoluteDeviation,
    getMedian,
    getMedianAbsoluteDeviation,
    MODIFIED_Z_SCORE,
} from '../modZScore'

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

describe('getModZScoreHelper', () => {
    const helper = getOutlierHelper(
        [
            [2, 1],
            [3, 1],
            [6, 2],
            [5, 1],
            [6, 1],
            [7, 1],
            [14, 2],
            [8, 1],
            [9, 1],
            [10, 1],
            [40, 1],
        ],
        {
            outlierMethod: MODIFIED_Z_SCORE,
            percentile: 1,
        }
    )

    helper.detectOutliers()

    //TODO add tests
})
