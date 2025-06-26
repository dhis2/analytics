import PropTypes from 'prop-types'
import React, {
    createContext,
    useCallback,
    useContext,
    useRef,
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

const HoverMenuBar = ({
    children,
    dataTest = 'dhis2-analytics-hovermenubar',
}) => {
    const [openedDropdownEl, setOpenedDropdownEl] = useState(null)
    const lastHoveredSubMenuElRef = useRef(null)
    const [isInHoverMode, setIsInHoverMode] = useState(false)

    const closeMenu = useCallback(() => {
        setIsInHoverMode(false)
        setOpenedDropdownEl(null)
    }, [])

    const setLastHoveredSubMenuEl = useCallback((element) => {
        lastHoveredSubMenuElRef.current = element
    }, [])

    const onDocumentClick = useCallback(
        (event) => {
            const isClickOnOpenedSubMenuAnchor =
                lastHoveredSubMenuElRef.current &&
                (lastHoveredSubMenuElRef.current === event.target ||
                    lastHoveredSubMenuElRef.current.contains(event.target))

            if (!isClickOnOpenedSubMenuAnchor) {
                closeMenu()
            }
        },
        [closeMenu]
    )

    const onDropDownButtonClick = useCallback(
        (event) => {
            if (!isInHoverMode) {
                /* Stop event propagation to avoid it from bubling up to the
                 * document, which would actually cause the menu to close again
                 * immediately */
                event.stopPropagation()
                setIsInHoverMode(true)
                setOpenedDropdownEl(event.currentTarget)
                document.addEventListener('click', onDocumentClick, {
                    once: true,
                })
            } else {
                document.removeEventListener('click', onDocumentClick)
                closeMenu()
            }
        },
        [closeMenu, isInHoverMode, onDocumentClick]
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
                /* Blurring the active element is needed here to prevent
                 * the menu button which was clicked to open the hovermenu
                 * from getting the blue outline style. This looks a bit off
                 * in all cases, but especially when the menu item which was
                 * clicked to open the hover menu isn't the currently opened
                 * dropdown menu. This doesn't have to be the case since
                 * dropdown menues open on hover once the first one has been
                 * clicked. */
                document.activeElement.blur()
                closeMenu()
            }
        },
        [closeMenu]
    )

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

HoverMenuBar.propTypes = {
    children: PropTypes.node.isRequired,
    dataTest: PropTypes.string,
}
export { HoverMenuBar, useHoverMenubarContext }
