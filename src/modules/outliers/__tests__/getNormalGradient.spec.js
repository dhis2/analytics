import { getNormalGradient } from '../getNormalGradient'

const expectedType = 'number'

describe('getNormalGradient', () => {
    it('should return a number', () => {
        const graphGradient = 0.8
        const normalGradient = getNormalGradient(graphGradient)

        expect(typeof normalGradient).toBe(expectedType)
    })
})
