import PropTypes from 'prop-types'
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'

const throwErrorIfNotInitialized = () => {
    throw new Error('`HoverMenubarContext` has not been initialised')
}

const HoverMenubarContext = createContext({
    closeMenu: throwErrorIfNotInitialized,
    onDropDownButtonClick: throwErrorIfNotInitialized,
    onDropDownButtonMouseOver: throwErrorIfNotInitialized,
    setLastHoveredSubMenuEl: throwErrorIfNotInitialized,
    openedDropdownEl: null,
})

const useHoverMenubarContext = () => useContext(HoverMenubarContext)

const HoverMenuBar = ({ children, dataTest }) => {
    const [openedDropdownEl, setOpenedDropdownEl] = useState(null)
    const [lastHoveredSubMenuEl, setLastHoveredSubMenuEl] = useState(null)
    const [isInHoverMode, setIsInHoverMode] = useState(false)

    const closeMenu = useCallback(() => {
        setIsInHoverMode(false)
        setOpenedDropdownEl(null)
    }, [])

    const onDocumentClick = useCallback(
        (event) => {
            const isClickOnOpenedSubMenuAnchor =
                lastHoveredSubMenuEl &&
                (lastHoveredSubMenuEl === event.target ||
                    lastHoveredSubMenuEl.contains(event.target))

            if (!isClickOnOpenedSubMenuAnchor) {
                closeMenu()
            }
        },
        [closeMenu, lastHoveredSubMenuEl]
    )

    const onDropDownButtonClick = useCallback(
        (event) => {
            if (!isInHoverMode) {
                setIsInHoverMode(true)
                setOpenedDropdownEl(event.currentTarget)
            } else {
                closeMenu()
            }
        },
        [closeMenu, isInHoverMode]
    )

    const onDropDownButtonMouseOver = useCallback(
        (event) => {
            if (isInHoverMode) {
                setOpenedDropdownEl(event.currentTarget)
            }
        },
        [isInHoverMode]
    )

    const closeMenuWithEsc = useCallback(
        (event) => {
            if (event.keyCode === 27) {
                closeMenu()
            }
        },
        [closeMenu]
    )

    useEffect(() => {
        if (isInHoverMode) {
            document.addEventListener('click', onDocumentClick, {
                once: true,
            })
        }

        return () => {
            document.removeEventListener('click', onDocumentClick)
        }
    }, [onDocumentClick, isInHoverMode])

    return (
        <HoverMenubarContext.Provider
            value={{
                onDropDownButtonClick,
                onDropDownButtonMouseOver,
                openedDropdownEl,
                setLastHoveredSubMenuEl,
            }}
        >
            <div onKeyDown={closeMenuWithEsc} data-test={dataTest}>
                {children}
                <style jsx>{`
                    display: flex;
                    flex-grow: 1;
                `}</style>
            </div>
        </HoverMenubarContext.Provider>
    )
}

HoverMenuBar.defaultProps = {
    dataTest: 'dhis2-analytics-hovermenubar',
}

HoverMenuBar.propTypes = {
    children: PropTypes.node.isRequired,
    dataTest: PropTypes.string,
}
export { HoverMenuBar, useHoverMenubarContext }
