import { getIntersectionPoint } from '../getIntersectionPoint'

describe('getIntersectionPoint', () => {
    it('should return a point coordinate', () => {
        const curve1 = [
            [1, 1],
            [3, 3],
        ]
        const curve2 = [
            [1, 3],
            [3, 1],
        ]
        const intersectionPoint = getIntersectionPoint(...curve1, ...curve2)

        expect(intersectionPoint).toEqual([2, 2])
    })
})
