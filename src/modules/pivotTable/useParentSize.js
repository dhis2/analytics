import { useState, useEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

export const useParentSize = (
    elementRef,
    renderCounter,
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

        if (renderCounter) {
            setSize({ width: undefined })
        }

        const observer = new ResizeObserver(onResize)
        observer.observe(el)

        return () => observer.disconnect()
    }, [elementRef, renderCounter])

    return size
}
