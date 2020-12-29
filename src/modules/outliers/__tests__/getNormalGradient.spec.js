import { getNormalGradient } from '../getNormalGradient'

describe('getNormalGradient', () => {
    it('should return a number', () => {
        const graphGradient = 0.8
        const normalGradient = getNormalGradient(graphGradient)

        expect(typeof normalGradient).toBe('number')
    })
})
