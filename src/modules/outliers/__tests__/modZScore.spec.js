import { defaultConfig } from '..'
import {
    getMean,
    getMeanAbsoluteDeviation,
    getMedian,
    getMedianAbsoluteDeviation,
    MOD_Z_SCORE,
    getModZScoreHelper,
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
    const helper = getModZScoreHelper(
        [
            { point: [2, 1], normalized: 2 },
            { point: [3, 1], normalized: 3 },
            { point: [6, 2], normalized: 3 },
            { point: [5, 1], normalized: 5 },
            { point: [6, 1], normalized: 6 },
            { point: [7, 1], normalized: 7 },
            { point: [14, 2], normalized: 7 },
            { point: [8, 1], normalized: 8 },
            { point: [9, 1], normalized: 9 },
            { point: [10, 1], normalized: 10 },
            { point: [40, 1], normalized: 40 },
        ],
        {
            ...defaultConfig,
            method: MOD_Z_SCORE,
        }
    )

    helper.detectOutliers()

    console.log(helper)

    // test('interquartile range', () => {
    //     expect(helper.vars.iqr).toBe(9 - 3)
    // })

    // test('interquartile range threshold', () => {
    //     expect(helper.vars.iqrThreshold).toBe(1.5 * (9 - 3))
    // })

    // test('first quartile threshold', () => {
    //     expect(helper.vars.q1Threshold).toBe(3 - (9 - 3) * 1.5)
    // })

    // test('third quartile threshold', () => {
    //     expect(helper.vars.q3Threshold).toBe(9 + (9 - 3) * 1.5)
    // })

    // test('isLowOutlier', () => {
    //     expect(helper.isLowOutlier(-5)).toBe(false)
    //     expect(helper.isLowOutlier(-7)).toBe(true)
    // })

    // test('isHighOutlier', () => {
    //     expect(helper.isHighOutlier(17)).toBe(false)
    //     expect(helper.isHighOutlier(19)).toBe(true)
    // })

    // test('isOutlier', () => {
    //     expect(helper.isOutlier(0)).toBe(false)
    //     expect(helper.isOutlier(-20)).toBe(true)
    //     expect(helper.isOutlier(60)).toBe(true)
    // })
})
