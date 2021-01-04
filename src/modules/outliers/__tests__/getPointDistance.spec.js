import { getPointDistance } from '../getPointDistance'

describe('getPointDistance', () => {
    it('should return the distance as a number', () => {
        const p1 = [189, 15]
        const p2 = [187, 78]
        const a = p2[0] - p1[0]
        const b = p2[1] - p1[1]
        const pointDistance = getPointDistance(p1, p2)
        const expectedDistance = Math.sqrt(a * a + b * b)

        expect(pointDistance).toBe(expectedDistance)
    })
})
