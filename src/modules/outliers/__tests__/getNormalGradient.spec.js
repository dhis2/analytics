import { getNormalGradient } from '../getNormalGradient'

describe('getNormalGradient', () => {
    it('should return a number', () => {
        const lineGradient = 0.8
        const normalGradient = getNormalGradient(lineGradient)

        expect(typeof normalGradient).toBe('number')
    })
})
