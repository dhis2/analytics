import { Popper, Portal } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef } from 'react'
import menuButtonStyles from '../MenuButton.styles.js'
import { useHoverMenuBarContext } from './HoverMenuBar.js'

export const Dropdown = ({ children, label, disabled }) => {
    const buttonRef = useRef()
    const {
        onDropDownButtonClick,
        onDropDownButtonMouseOver,
        openedDropdownEl,
    } = useHoverMenuBarContext()
    const isOpen = openedDropdownEl === buttonRef.current

    return (
        <>
            <button
                ref={buttonRef}
                onClick={onDropDownButtonClick}
                disabled={disabled}
                onMouseOver={onDropDownButtonMouseOver}
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

Dropdown.propTypes = {
    children: PropTypes.node.isRequired,
    label: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
}