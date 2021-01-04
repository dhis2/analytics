import { getRegression } from '../getRegression'

describe('getRegression', () => {
    it('(linear) should return an object with points and equation', () => {
        const points = [
            [1, 1],
            [3, 3],
            [4, 4],
            [5, 4],
        ]
        const reg = getRegression(points)

        expect(typeof reg).toBe('object')

        // reg.points
        expect(Array.isArray(reg.points)).toBe(true)
        expect(reg.points.length).toBe(points.length)
        expect(Array.isArray(reg.points[0])).toBe(true)
        expect(typeof reg.points[0][0]).toBe('number')
        expect(typeof reg.points[0][1]).toBe('number')

        // reg.equation
        expect(Array.isArray(reg.equation)).toBe(true)
        expect(reg.equation.length).toBe(2)
        expect(typeof reg.equation[0]).toBe('number')
        expect(typeof reg.equation[1]).toBe('number')
    })
})
