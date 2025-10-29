import { useState, useEffect } from 'react'

const initialState = { width: 0, height: 0 }

export const useParentSize = ({
    elementRef,
    renderCounter,
    initialSize = initialState,
    availableWidth,
}) => {
    const [size, setSize] = useState({
        width: availableWidth || initialSize.width || 0,
        height: initialSize.height || 0,
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

        const observer = new window.ResizeObserver(() => {
            if (renderCounter) {
                setSize(initialState)
            }

            return onResize()
        })
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
