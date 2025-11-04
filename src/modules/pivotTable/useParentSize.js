import { useState, useEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

const initialSize = { width: 0, height: 0 }

export const useParentSize = (elementRef, renderCounter) => {
    const [size, setSize] = useState(initialSize)

    useEffect(() => {
        const el = elementRef.current && elementRef.current.parentElement
        if (!el) {
            return
        }

        const onResize = () => {
            setTimeout(
                () =>
                    setSize({
                        width: el.clientWidth,
                        height: el.clientHeight,
                    }),
                0
            )
        }

        onResize(el)

        if (renderCounter) {
            setSize(initialSize)
        }

        const observer = new ResizeObserver(onResize)
        observer.observe(el)

        return () => observer.disconnect()
    }, [elementRef, renderCounter])

    return size
}
