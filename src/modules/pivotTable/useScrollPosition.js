import debounce from 'lodash/debounce'
import { useState, useCallback, useEffect } from 'react'

export const useScrollPosition = (containerRef, debounceWait = 10) => {
    const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })

    const onScroll = useCallback(
        debounce(() => {
            const scroll = {
                x: containerRef.current.scrollLeft,
                y: containerRef.current.scrollTop,
            }
            setScrollPosition(scroll)
        }, debounceWait)
    )

    useEffect(() => {
        const currentRef = containerRef.current
        if (!currentRef) {
            return
        }

        currentRef.addEventListener('scroll', onScroll)
        return () => {
            currentRef.removeEventListener('scroll', onScroll)
        }
    }, [containerRef, onScroll])

    return scrollPosition
}
