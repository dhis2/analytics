import { IconCross16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/DeselectIconButton.style'

export const DeselectIconButton = ({ fill, onClick }) => {
    const iconStyle = {
        height: '13px',
        width: '10px',
        fill,
    }

    return (
        <button
            className="deselect-icon-button"
            onClick={e => {
                e.stopPropagation()
                onClick()
            }}
        >
            <span style={iconStyle}>
                <IconCross16 />
            </span>
            <style jsx>{styles}</style>
        </button>
    )
}

DeselectIconButton.propTypes = {
    fill: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
}

export default DeselectIconButton
