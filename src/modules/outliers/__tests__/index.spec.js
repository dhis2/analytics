import { getOutlierHelper } from '..'
import { IQR } from '../iqr'
import { MODIFIED_Z_SCORE } from '../modZScore'
import { STANDARD_Z_SCORE } from '../zScore'

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

describe('performance with 1 mill points', () => {
    const getRandomInt = (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min

    const data = []

    for (let i = 0; i < 1000000; i++) {
        data.push([getRandomInt(-1000, 1000), getRandomInt(-1000, 1000)])
    }

    it('IQR should take less than 3 seconds', () => {
        const t1 = performance.now()
        const helper = getOutlierHelper(data, { outlierMethod: IQR })
        helper.detectOutliers()
        const t2 = performance.now()
        console.log(t2)
        expect(t2 - t1 < 3000).toBe(true)
    })

    it('SZS should take less than 4 seconds', () => {
        const t1 = performance.now()
        const helper = getOutlierHelper(data, {
            outlierMethod: STANDARD_Z_SCORE,
        })
        helper.detectOutliers()
        const t2 = performance.now()
        console.log(t2)
        expect(t2 - t1 < 4000).toBe(true)
    })

    it('MZS should take less than 4 seconds', () => {
        const t1 = performance.now()
        const helper = getOutlierHelper(data, {
            outlierMethod: MODIFIED_Z_SCORE,
        })
        helper.detectOutliers()
        const t2 = performance.now()
        console.log(t2)
        expect(t2 - t1 < 4000).toBe(true)
    })
})
