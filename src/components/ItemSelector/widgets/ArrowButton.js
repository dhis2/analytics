import { IconArrowLeft24, IconArrowRight24 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/ArrowButton.style'

export const ArrowButton = ({ onClick, iconType }) => (
    <button className="arrow-button" onClick={onClick}>
        <span className="arrow-icon">
            {iconType === 'arrowForward' ? (
                <IconArrowRight24 />
            ) : (
                <IconArrowLeft24 />
            )}
        </span>
        <style jsx>{styles}</style>
    </button>
)

ArrowButton.propTypes = {
    iconType: PropTypes.string,
    onClick: PropTypes.func,
}

export default ArrowButton
