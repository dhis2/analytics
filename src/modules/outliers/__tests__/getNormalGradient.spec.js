import { getNormalGradient } from '../getNormalGradient'

const expectedType = 'number'

describe('getNormalGradient', () => {
    it('should return a number', () => {
        const lineGradient = 0.8
        const normalGradient = getNormalGradient(lineGradient)

        expect(typeof normalGradient).toBe(expectedType)
    })
})
