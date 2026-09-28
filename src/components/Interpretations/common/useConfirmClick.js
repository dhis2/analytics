import { useCallback, useEffect, useRef, useState } from 'react'

const CONFIRM_TIMEOUT_MS = 3000

const useConfirmClick = (action) => {
    const [isConfirming, setIsConfirming] = useState(false)
    const timeoutRef = useRef(null)

    const clearResetTimer = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    }, [])

    useEffect(() => clearResetTimer, [clearResetTimer])

    const onClick = useCallback(() => {
        if (isConfirming) {
            clearResetTimer()
            setIsConfirming(false)
            action()
        } else {
            setIsConfirming(true)
            timeoutRef.current = setTimeout(() => {
                timeoutRef.current = null
                setIsConfirming(false)
            }, CONFIRM_TIMEOUT_MS)
        }
    }, [isConfirming, action, clearResetTimer])

    return { isConfirming, onClick }
}

export { useConfirmClick }
