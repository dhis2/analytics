import { useState, useEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

const initialState = { width: 0, height: 0 }

export const useParentSize = (
    elementRef,
    renderCounter,
    initialSize = initialState
) => {
    console.log('jj useParentSize renderCounter', renderCounter)
    const [size, setSize] = useState({
        width: initialSize.width || 0,
        height: initialSize.height || 0,
    })

    useEffect(() => {
        const el = elementRef.current && elementRef.current.parentElement
        if (!el) {
            return
        }

        const onResize = () => {
            console.log('jj useEffect onResize fn to width', el.clientWidth)
            setSize({
                width: el.clientWidth,
                height: el.clientHeight,
            })
        }

        console.log('jj useEffect call onResize')
        onResize(el)

        if (renderCounter) {
            console.log('jj useEffect set size to 0,0')
            setSize(initialState)
        }

        const observer = new ResizeObserver(() => {
            console.log('jj resize observed')
            return onResize()
        })
        observer.observe(el)

        return () => observer.disconnect()
    }, [elementRef, renderCounter])

    return size
}
