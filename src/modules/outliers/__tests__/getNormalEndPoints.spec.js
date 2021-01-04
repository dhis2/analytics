import { getNormalEndPoints } from '../getNormalEndPoints'

const expectedType = 'number'

describe('getNormalEndPoints', () => {
    it('should return start/end points of the normal', () => {
        const dataPoint = [5, 5]
        const normalGradient = -1
        const normalEndPoints = getNormalEndPoints(dataPoint, normalGradient)

        expect(Array.isArray(normalEndPoints)).toBe(true)
        expect(normalEndPoints.length).toBe(2)
        expect(normalEndPoints[0].length).toBe(2)
        expect(typeof normalEndPoints[0][0]).toBe(expectedType)
        expect(typeof normalEndPoints[0][1]).toBe(expectedType)
        expect(normalEndPoints[1].length).toBe(2)
        expect(typeof normalEndPoints[1][0]).toBe(expectedType)
        expect(typeof normalEndPoints[1][1]).toBe(expectedType)
    })
})
