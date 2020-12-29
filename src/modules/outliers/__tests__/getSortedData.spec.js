import { getSortedData } from '../getSortedData'

describe('getSortedData', () => {
    it('should sort data points based on the x value', () => {
        const data = [
            [3, 5],
            [2, 9],
            [5, 3],
            [4, 7],
        ]
        const sortedData = getSortedData(data)

        expect(sortedData).toEqual([
            [2, 9],
            [3, 5],
            [4, 7],
            [5, 3],
        ])
    })
})
