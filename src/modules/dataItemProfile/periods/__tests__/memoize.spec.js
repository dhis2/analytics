import { memoize } from '../memoize.js'

describe('memoize', () => {
    it('computes once per arguments', () => {
        const double = jest.fn((a, b) => [a, b])
        const memoized = memoize(double)

        expect(memoized(1, 2)).toBe(memoized(1, 2))
        expect(memoized(2, 1)).toEqual([2, 1])
        expect(double).toHaveBeenCalledTimes(2)
    })

    it('starts over when full', () => {
        const identity = jest.fn((a) => ({ a }))
        const memoized = memoize(identity, { maxSize: 2 })

        memoized(1)
        memoized(2)
        memoized(3)
        memoized(2)

        expect(identity).toHaveBeenCalledTimes(4)
    })

    it('takes a key of its own', () => {
        const read = jest.fn(({ id }) => id)
        const memoized = memoize(read, { getKey: ({ id }) => id })

        memoized({ id: 'a', other: 1 })
        memoized({ id: 'a', other: 2 })

        expect(read).toHaveBeenCalledTimes(1)
    })
})
