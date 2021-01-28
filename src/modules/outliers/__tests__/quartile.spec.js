import {
    getQuartilePosition,
    getQuartileValue,
    getQuartileHelper,
} from '../quartile'

const a3 = [2, 4, 5]
const a4 = [2, 4, 5, 7]
const a5 = [2, 4, 5, 7, 15]
const a6 = [2, 4, 5, 7, 15, 40]

describe('getQuartilePosition', () => {
    describe('first quartile position', () => {
        test('no skewness', () => {
            expect(getQuartilePosition(a3, 0.25)).toBe(1)
        })
        test('.25 skewness', () => {
            expect(getQuartilePosition(a4, 0.25)).toBe(1.25)
        })
        test('.50 skewness', () => {
            expect(getQuartilePosition(a5, 0.25)).toBe(1.5)
        })
        test('.75 skewness', () => {
            expect(getQuartilePosition(a6, 0.25)).toBe(1.75)
        })
    })

    describe('second quartile position', () => {
        test('no skewness', () => {
            expect(getQuartilePosition(a3, 0.5)).toBe(2)
        })
        test('.25 skewness', () => {
            expect(getQuartilePosition(a4, 0.5)).toBe(2.5)
        })
        test('.50 skewness', () => {
            expect(getQuartilePosition(a5, 0.5)).toBe(3)
        })
        test('.75 skewness', () => {
            expect(getQuartilePosition(a6, 0.5)).toBe(3.5)
        })
    })

    describe('third quartile position', () => {
        test('no skewness', () => {
            expect(getQuartilePosition(a3, 0.75)).toBe(3)
        })
        test('.25 skewness', () => {
            expect(getQuartilePosition(a4, 0.75)).toBe(3.75)
        })
        test('.50 skewness', () => {
            expect(getQuartilePosition(a5, 0.75)).toBe(4.5)
        })
        test('.75 skewness', () => {
            expect(getQuartilePosition(a6, 0.75)).toBe(5.25)
        })
    })
})

describe('getQuartileValue', () => {
    describe('first quartile value', () => {
        test('no skewness', () => {
            expect(getQuartileValue(a3, 0.25)).toBe(2)
        })
        test('.25 skewness', () => {
            expect(getQuartileValue(a4, 0.25)).toBe(2.5)
        })
        test('.50 skewness', () => {
            expect(getQuartileValue(a5, 0.25)).toBe(3)
        })
        test('.75 skewness', () => {
            expect(getQuartileValue(a6, 0.25)).toBe(3.5)
        })
    })

    describe('second quartile value', () => {
        test('no skewness', () => {
            expect(getQuartileValue(a3, 0.5)).toBe(4)
        })
        test('.25 skewness', () => {
            expect(getQuartileValue(a4, 0.5)).toBe(4.5)
        })
        test('.50 skewness', () => {
            expect(getQuartileValue(a5, 0.5)).toBe(5)
        })
        test('.75 skewness', () => {
            expect(getQuartileValue(a6, 0.5)).toBe(6)
        })
    })

    describe('third quartile value', () => {
        test('no skewness', () => {
            expect(getQuartileValue(a3, 0.75)).toBe(5)
        })
        test('.25 skewness', () => {
            expect(getQuartileValue(a4, 0.75)).toBe(6.5)
        })
        test('.50 skewness', () => {
            expect(getQuartileValue(a5, 0.75)).toBe(11)
        })
        test('.75 skewness', () => {
            expect(getQuartileValue(a6, 0.75)).toBe(21.25)
        })
    })
})

describe('getQuartileHelper', () => {
    const data = [2, 3, 3, 5, 6, 7, 7, 8, 9, 10, 40]
    const thresholdFactor = 1.5
    const helper = getQuartileHelper(data, { thresholdFactor, isSorted: true })

    test('interquartile range', () => {
        expect(helper.iqr).toBe(9 - 3)
    })

    test('interquartile range threshold', () => {
        expect(helper.iqrThreshold).toBe(1.5 * (9 - 3))
    })

    test('first quartile threshold', () => {
        expect(helper.q1Threshold).toBe(3 - (9 - 3) * 1.5)
    })

    test('third quartile threshold', () => {
        expect(helper.q3Threshold).toBe(9 + (9 - 3) * 1.5)
    })

    test('isLowOutlier', () => {
        expect(helper.isLowOutlier(-5)).toBe(false)
        expect(helper.isLowOutlier(-7)).toBe(true)
    })

    test('isHighOutlier', () => {
        expect(helper.isHighOutlier(17)).toBe(false)
        expect(helper.isHighOutlier(19)).toBe(true)
    })

    test('isOutlier', () => {
        expect(helper.isOutlier(0)).toBe(false)
        expect(helper.isOutlier(-20)).toBe(true)
        expect(helper.isOutlier(60)).toBe(true)
    })

    test('getOutliers', () => {
        expect(helper.getOutliers()).toEqual([40])
    })
})
