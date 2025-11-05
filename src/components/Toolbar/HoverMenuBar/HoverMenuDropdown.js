import { Popper, Portal } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useRef } from 'react'
import menuButtonStyles from '../MenuButton.styles.js'
import { useHoverMenubarContext } from './HoverMenuBar.js'

export const HoverMenuDropdown = ({
    children,
    className,
    label,
    dataTest = 'dhis2-analytics-hovermenudropdown',
    disabled,
}) => {
    const buttonRef = useRef()
    const {
        onDropDownButtonClick,
        onDropDownButtonMouseOver,
        openedDropdownEl,
    } = useHoverMenubarContext()
    const isOpen = openedDropdownEl === buttonRef.current

    return (
        <>
            <button
                className={cx(className, { isOpen })}
                ref={buttonRef}
                onClick={onDropDownButtonClick}
                disabled={disabled}
                onMouseOver={disabled ? undefined : onDropDownButtonMouseOver}
                data-test={dataTest}
            >
                {label}
                <style jsx>{menuButtonStyles}</style>
            </button>
            {isOpen && (
                <Portal>
                    <Popper placement="bottom-start" reference={buttonRef}>
                        {children}
                    </Popper>
                </Portal>
            )}
        </>
    )
}

HoverMenuDropdown.propTypes = {
    children: PropTypes.node.isRequired,
    label: PropTypes.node.isRequired,
    className: PropTypes.string,
    dataTest: PropTypes.string,
    disabled: PropTypes.bool,
}
