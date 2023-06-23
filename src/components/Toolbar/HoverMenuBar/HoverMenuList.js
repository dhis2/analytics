import { colors, elevations, spacers } from '@dhis2/ui-constants'
import PropTypes from 'prop-types'
import React, { createContext, useCallback, useContext, useState } from 'react'
import { useHoverMenubarContext } from './HoverMenuBar.js'

const throwErrorIfNotInitialized = () => {
    throw new Error('`HoverMenuListContext` has not been initialised')
}

const HoverMenuListContext = createContext({
    onSubmenuAnchorMouseEnter: throwErrorIfNotInitialized,
    onMenuItemMouseEnter: throwErrorIfNotInitialized,
    openedSubMenuEl: null,
    dense: false,
})

const useHoverMenuListContext = () => useContext(HoverMenuListContext)

const HoverMenuList = ({
    children,
    className,
    dataTest,
    dense,
    maxHeight,
    maxWidth,
}) => {
    const { setLastHoveredSubMenuEl } = useHoverMenubarContext()
    const [openedSubMenuEl, setOpenedSubMenuEl] = useState(null)

    const onSubmenuAnchorMouseEnter = useCallback(
        (event) => {
            if (openedSubMenuEl !== event.currentTarget) {
                setOpenedSubMenuEl(event.currentTarget)
                setLastHoveredSubMenuEl(event.currentTarget)
            }
        },
        [openedSubMenuEl, setLastHoveredSubMenuEl]
    )

    const onMenuItemMouseEnter = useCallback(() => {
        setOpenedSubMenuEl(null)
        setLastHoveredSubMenuEl(null)
    }, [setLastHoveredSubMenuEl])

    return (
        <HoverMenuListContext.Provider
            value={{
                onSubmenuAnchorMouseEnter,
                onMenuItemMouseEnter,
                openedSubMenuEl,
                dense,
            }}
        >
            <ul className={className} data-test={dataTest}>
                {children}
                <style jsx>{`
                    ul {
                        position: relative;
                        margin: 0;
                        padding: 0;
                        user-select: none;
                        background: ${colors.white};
                        border: 1px solid ${colors.grey200};
                        border-radius: 3px;
                        box-shadow: ${elevations.e300};
                        display: inline-block;
                        min-width: ${dense ? '128' : '180'}px;
                        max-width: ${maxWidth};
                        max-height: ${maxHeight};
                        padding: ${spacers.dp4} 0;
                        overflow: auto;
                        list-style: none;
                    }
                `}</style>
            </ul>
        </HoverMenuListContext.Provider>
    )
}

HoverMenuList.defaultProps = {
    dataTest: 'dhis2-analytics-hovermenulist',
    maxWidth: '380px',
    maxHeight: 'auto',
}

HoverMenuList.propTypes = {
    /** Typically `MenuItem`, `MenuDivider`, and `MenuSectionHeader` */
    children: PropTypes.node,
    className: PropTypes.string,
    dataTest: PropTypes.string,
    /** Gives all HoverMenuListItem children a dense style */
    dense: PropTypes.bool,
    maxHeight: PropTypes.string,
    maxWidth: PropTypes.string,
}

export { HoverMenuList, useHoverMenuListContext }
