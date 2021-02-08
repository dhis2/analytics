import { std } from 'mathjs'

import { getOutlierHelper } from '..'

jest.mock('mathjs')

describe('getOutlierHelper', () => {
    it('returs the outlier helper', () => {
        const outlierPoint = [40, 1]
        const data = [
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
            outlierPoint,
        ]

        const helper = getOutlierHelper(data)
        helper.detectOutliers()

        expect(helper.outlierPoints[0]).toBe(outlierPoint)
    })
})
