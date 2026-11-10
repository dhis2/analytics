import { useState, useEffect } from 'react'
import { useDebounce } from './utils.js'

const MODAL_SIDE_PADDING = 2 * 24
const MODAL_SIDE_MARGINS = 2 * 128

const computeModalContentWidth = (windowWidth, minWidth, maxWidth) => {
    const width = windowWidth - MODAL_SIDE_MARGINS - MODAL_SIDE_PADDING
    return Math.min(Math.max(width, minWidth), maxWidth)
}

export const useModalContentWidth = ({
    minWidth = 0,
    maxWidth = Infinity,
} = {}) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const debouncedWindowWidth = useDebounce(windowWidth, 150)
    const [modalContentWidth, setModalContentWidth] = useState(
        computeModalContentWidth(windowWidth, minWidth, maxWidth)
    )

    useEffect(() => {
        const onResize = () => {
            setWindowWidth(window.innerWidth)
        }
        window.addEventListener('resize', onResize)

        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [])

    useEffect(() => {
        setModalContentWidth(
            computeModalContentWidth(debouncedWindowWidth, minWidth, maxWidth)
        )
    }, [debouncedWindowWidth, minWidth, maxWidth])

    return modalContentWidth
}
