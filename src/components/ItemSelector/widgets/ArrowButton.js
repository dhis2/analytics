import React from 'react'
import PropTypes from 'prop-types'
import ArrowForward from '@material-ui/icons/ArrowForward'
import ArrowBack from '@material-ui/icons/ArrowBack'
import styles from './styles/ArrowButton.style'

export const ArrowButton = ({ onClick, iconType }) => (
    <button className="arrow-button" onClick={onClick}>
        <span className="arrow-icon">
            {iconType === 'arrowForward' ? <ArrowForward /> : <ArrowBack />}
        </span>
        <style jsx>{styles}</style>
    </button>
)

ArrowButton.propTypes = {
    iconType: PropTypes.string,
    onClick: PropTypes.func,
}

export default ArrowButton
