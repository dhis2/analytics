import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles/PeriodTypeButton.style'

const PeriodTypeButton = ({ active, text, onClick }) => {
    return (
        <button className={active ? 'active' : ''} onClick={onClick}>
            <span>{text}</span>
            <style jsx>{styles}</style>
        </button>
    )
}

PeriodTypeButton.propTypes = {
    active: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
}

export default PeriodTypeButton
