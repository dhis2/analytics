import { getHash } from '../hash.js'

describe('getHash', () => {
    const textInput = 'Raymond Luxury Yacht'

    it('accepts a string and returns a hash', () => {
        const hash = getHash(textInput)

        expect(typeof hash).toBe('string')
        expect(hash).not.toBe(textInput)
    })

    it('is deterministic', () => {
        expect(getHash(textInput)).toBe(getHash(textInput))
    })

    it('accepts array', () => {
        expect(getHash('abc')).toBe(getHash(['a', 'b', 'c']))
    })

    it('accepts number', () => {
        expect(typeof getHash(1)).toBe('string')
    })

    it('returns undefined for unsupported types', () => {
        const unsupportedTypes = [undefined, null, true, false, {}]

        unsupportedTypes.forEach((type) =>
            expect(getHash(type)).toBe(undefined)
        )
    })
})
