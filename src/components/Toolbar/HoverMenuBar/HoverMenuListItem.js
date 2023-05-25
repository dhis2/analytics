import { Popper } from '@dhis2-ui/popper'
import { Portal } from '@dhis2-ui/portal'
import { IconChevronRight24 } from '@dhis2/ui-icons'
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
    dataTest,
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

HoverMenuListItem.defaultProps = {
    dataTest: 'dhis2-uicore-menuitem',
}

HoverMenuListItem.propTypes = {
    /**
     * Nested menu items can become submenus.
     * See `showSubMenu` and `toggleSubMenu` props, and 'Children' demo
     */
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
