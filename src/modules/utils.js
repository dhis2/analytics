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
export function isNumeric(param) {
    if (typeof param === 'symbol') {
        return false
    }

    return !isNaN(parseFloat(param)) && Number.isFinite(param)
}
