import { useState, useEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

export const useParentSize = (
    elementRef,
    renderId,
    initialSize = { width: 0, height: 0 }
) => {
    const [size, setSize] = useState({
        width: initialSize.width || 0,
        height: initialSize.height || 0,
    })

    useEffect(() => {
        const el = elementRef.current && elementRef.current.parentElement
        if (!el) return

        const onResize = () => {
            setSize({
                width: el.clientWidth,
                height: el.clientHeight,
            })
        }

        onResize(el)

        if (renderId) {
            setSize({ width: 0 })
        }

        const observer = new ResizeObserver(onResize)
        observer.observe(el)

        return () => observer.disconnect()
    }, [elementRef, renderId])

    return size
}
