import { Popper } from '@dhis2-ui/popper'
import { Portal } from '@dhis2-ui/portal'
import PropTypes from 'prop-types'
import React, { useRef } from 'react'
import menuButtonStyles from '../MenuButton.styles.js'
import { useHoverMenubarContext } from './HoverMenubar.js'

export const HoverMenuDropdown = ({ children, label, disabled }) => {
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

HoverMenuDropdown.propTypes = {
    children: PropTypes.node.isRequired,
    label: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
}
