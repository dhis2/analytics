import { getStdDev } from '../getStdDev'

const expectedType = 'number'

describe('getStdDev', () => {
    it('should return a number', () => {
        const points = [
            [1, 1],
            [3, 3],
            [4, 4],
            [5, 4],
        ]
        const stdDev = getStdDev(points)

        expect(typeof stdDev).toBe(expectedType)
    })
})
