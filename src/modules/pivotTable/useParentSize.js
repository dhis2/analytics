import { useState, useEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

const initialState = { width: 0, height: 0 }

export const useParentSize = (
    elementRef,
    renderCounter,
    initialSize = initialState
) => {
    console.log('jj useParentSize', { renderCounter, initialSize })
    const [size, setSize] = useState({
        width: initialSize.width || 0,
        height: initialSize.height || 0,
    })

    useEffect(() => {
        console.log('jj useParentSize useEffect')
        const el = elementRef.current && elementRef.current.parentElement
        if (!el) {
            return
        }

        const onResize = () => {
            console.log('jj useParentSize useEffect onResize', {
                width: el.clientWidth,
                height: el.clientHeight,
            })
            setSize({
                width: el.clientWidth,
                height: el.clientHeight,
            })
        }

        onResize(el)

        if (renderCounter) {
            console.log(
                'jj useParentSize useEffect reset size to',
                initialState
            )
            setSize(initialState)
        }

        const observer = new ResizeObserver(onResize)
        observer.observe(el)

        return () => observer.disconnect()
    }, [elementRef, renderCounter])

    return size
}
