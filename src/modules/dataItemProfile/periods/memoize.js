/* A cache for pure functions with a few small arguments. Period lookups in
 * multi-calendar-dates build a whole year of periods each time, about 7 ms:
 * the checks make thousands of them. The cache is cleared when it holds
 * `maxSize` entries, which bounds memory without tracking use. `getKey`
 * turns the arguments into the cache key (joined by default). */
export const memoize = (
    fn,
    { maxSize = 2000, getKey = (...args) => args.join('|') } = {}
) => {
    const cache = new Map()

    return (...args) => {
        const key = getKey(...args)

        if (!cache.has(key)) {
            if (cache.size >= maxSize) {
                cache.clear()
            }

            cache.set(key, fn(...args))
        }

        return cache.get(key)
    }
}
