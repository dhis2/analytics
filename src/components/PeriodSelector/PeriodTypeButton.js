import React, { Component } from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'

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
                {i18n.t(this.props.text)}
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
