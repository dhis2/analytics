import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './styles/PeriodTypeButton.style'

class PeriodTypeButton extends Component {
    handleClick = () => {
        this.props.onClick(this.props.periodType)
    }

    render = () => (
        <>
            <button
                className={`nav-button ${
                    this.props.periodType === this.props.activePeriodType
                        ? 'active'
                        : ''
                }`}
                onClick={this.handleClick}
            >
                {this.props.text}
            </button>
            <style jsx>{styles}</style>
        </>
    )
}

PeriodTypeButton.propTypes = {
    activePeriodType: PropTypes.string.isRequired,
    periodType: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
}

export default PeriodTypeButton
