import { useState, useEffect, useRef } from 'react'

export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])
    return debouncedValue
}

export const useDidUpdateEffect = (fn, inputs) => {
    const didMountRef = useRef(false)

    useEffect(() => {
        if (didMountRef.current) {
            fn()
        } else {
            didMountRef.current = true
        }
    }, inputs)
}

/**
 * Check if a value is numeric
 *
 * @param param Value to be checked
 * @returns {boolean} Returns true when the `param` is a numeric value
 */
export const isNumeric = (param) =>
    typeof param !== 'symbol' && !isNaN(parseFloat(param)) && isFinite(param)
