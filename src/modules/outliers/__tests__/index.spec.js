import { getOutlierHelper } from '..'

describe('getOutlierHelper', () => {
    it('should return a reference to the outlier points', () => {
        const outlierPoint1 = [8, 12]
        const outlierPoint2 = [40, 10]
        const data = [
            [2, 2],
            [3, 3],
            [6, 5],
            outlierPoint1,
            [12, 11],
            [15, 17],
            [20, 18],
            [24, 24],
            [30, 28],
            [35, 30],
            outlierPoint2,
        ]

        const helper = getOutlierHelper(data)
        helper.detectOutliers()

        expect(helper.outlierPoints[0]).toBe(outlierPoint1)
        expect(helper.outlierPoints[1]).toBe(outlierPoint2)
    })
})
