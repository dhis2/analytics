import { getXYStats } from '../xyStats.js'

const a = [
    [2, 3],
    [4, 5],
    [1, 2],
    [3, 4],
]

describe('xyStats', () => {
    const { xSum, ySum, xMin, xMax, yMin, yMax } = getXYStats(a)

    test('xSum', () => {
        expect(xSum).toBe(10)
    })

    test('ySum', () => {
        expect(ySum).toBe(14)
    })

    test('xMin', () => {
        expect(xMin).toBe(1)
    })

    test('xMax', () => {
        expect(xMax).toBe(4)
    })

    test('yMin', () => {
        expect(yMin).toBe(2)
    })

    test('yMax', () => {
        expect(yMax).toBe(5)
    })
})
