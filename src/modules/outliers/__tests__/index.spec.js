import { getOutlierHelper } from '..'

describe('getOutlierHelper', () => {
    it('should return a reference to the outlier points', () => {
        const outlierPoint1 = [8, 90]
        const data = [
            [2, 15],
            [3, 16],
            [6, 22],
            outlierPoint1,
            [12, 14],
            [15, 17],
            [20, 21],
            [24, 46],
            [30, 41],
            [35, 51],
        ]

        const helper = getOutlierHelper(data)
        helper.detectOutliers()

        expect(helper.outlierPoints[0]).toBe(outlierPoint1)
    })
})
