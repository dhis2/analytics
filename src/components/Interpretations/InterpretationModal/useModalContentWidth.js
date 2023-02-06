import { useState, useEffect } from 'react'
import { useDebounce } from '../../../modules/utils.js'

const MODAL_SIDE_PADDING = 2 * 24
const MODAL_SIDE_MARGINS = 2 * 128

const computeModalContentWidth = (windowWidth) => {
    return windowWidth - MODAL_SIDE_MARGINS - MODAL_SIDE_PADDING
}

export const useModalContentWidth = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const debouncedWindowWidth = useDebounce(windowWidth, 150)
    const [modalContentWidth, setModalContentWidth] = useState(
        computeModalContentWidth(windowWidth)
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
        setModalContentWidth(computeModalContentWidth(debouncedWindowWidth))
    }, [debouncedWindowWidth])

    return modalContentWidth
}
