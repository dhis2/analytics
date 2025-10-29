import { useState, useEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

const initialState = { width: 0, height: 0 }

export const useParentSize = ({
    elementRef,
    renderCounter,
    availableWidth,
}) => {
    const [size, setSize] = useState({
        width: availableWidth || initialState.width || 0,
        height: initialState.height || 0,
    })

    useEffect(() => {
        const el = elementRef.current && elementRef.current.parentElement
        if (!el) {
            return
        }

        const onResize = () => {
            setSize({
                width: el.clientWidth,
                height: el.clientHeight,
            })
        }

        onResize(el)

        if (renderCounter) {
            setSize(initialState)
        }

        const observer = new ResizeObserver(onResize)
        observer.observe(el)

        return () => observer.disconnect()
    }, [elementRef, renderCounter])

    useEffect(() => {
        setSize((prevSize) => ({
            ...prevSize,
            width: availableWidth || prevSize.width,
        }))
    }, [availableWidth])

    return size
}
