import { IconChevronRight24, Popper, Portal } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useRef } from 'react'
import { HoverMenuList, useHoverMenuListContext } from './HoverMenuList.js'
import styles from './HoverMenuListItem.styles.js'

const HoverMenuListItem = ({
    onClick,
    children,
    icon,
    className,
    destructive,
    disabled,
    dataTest = 'dhis2-uicore-hovermenulistitem',
    label,
}) => {
    const ref = useRef()
    const {
        onSubmenuAnchorMouseEnter,
        onMenuItemMouseEnter,
        openedSubMenuEl,
        dense,
    } = useHoverMenuListContext()

    const isSubMenuOpen = openedSubMenuEl === ref.current

    return (
        <>
            <li
                className={cx(className, {
                    destructive,
                    disabled,
                    dense,
                    active: isSubMenuOpen,
                    'with-chevron': children,
                })}
                ref={ref}
                data-test={dataTest}
                onClick={
                    !disabled && !children && onClick ? onClick : undefined
                }
                onMouseEnter={
                    disabled
                        ? undefined
                        : children
                        ? onSubmenuAnchorMouseEnter
                        : onMenuItemMouseEnter
                }
            >
                {icon && <span className="icon">{icon}</span>}

                <span className="label">{label}</span>

                {!!children && (
                    <span className="chevron">
                        <IconChevronRight24 />
                    </span>
                )}

                <style jsx>{styles}</style>
            </li>
            {children && isSubMenuOpen && (
                <Portal>
                    <Popper placement="right-start" reference={ref}>
                        <HoverMenuList dense={dense}>{children}</HoverMenuList>
                    </Popper>
                </Portal>
            )}
        </>
    )
}

HoverMenuListItem.propTypes = {
    // Nested menu items become submenus
    children: PropTypes.node,
    className: PropTypes.string,
    dataTest: PropTypes.string,
    destructive: PropTypes.bool,
    disabled: PropTypes.bool,
    /** An icon for the left side of the menu item */
    icon: PropTypes.node,
    /** Text in the menu item */
    label: PropTypes.node,
    /** Click handler */
    onClick: PropTypes.func,
}

export { HoverMenuListItem }
