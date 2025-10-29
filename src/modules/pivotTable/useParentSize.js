import { useState, useEffect } from 'react'

const initialState = { width: 0, height: 0 }

export const useParentSize = ({
    elementRef,
    renderCounter,
    initialSize = initialState,
    availableWidth,
}) => {
    console.log(
        'jj useParentSize counter, width',
        renderCounter,
        availableWidth
    )
    const [size, setSize] = useState({
        width: availableWidth || initialSize.width || 0,
        height: initialSize.height || 0,
    })

    useEffect(() => {
        const el = elementRef.current && elementRef.current.parentElement
        if (!el) {
            return
        }

        if (renderCounter) {
            console.log('jj useEffect set size to 0,0')
            setSize(initialState)
        }

        const onResize = () => {
            console.log('jj useEffect onResize fn to width', el.clientWidth)
            setSize({
                width: el.clientWidth,
                height: el.clientHeight,
            })
        }

        const observer = new window.ResizeObserver(() => {
            console.log('jj resize observed')
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
        console.log('jj useEffect width change to', availableWidth)
    }, [availableWidth])

    return size
}
