import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import styles from './styles/MathOperatorSelector.style.js'

const MathOperatorSelector = ({ onSelect }) => {
    const operators = [
        { value: '+', label: '+' },
        { value: '-', label: '-' },
        { value: '*', label: '×' },
        { value: '/', label: '/' },
        { value: '(', label: '(' },
        { value: ')', label: ')' },
    ]

    return (
        <>
            <div className="wrapper">
                <h4 className="sub-header">{i18n.t('Math operators')}</h4>
                <div className="operators">
                    {operators.map(({ value, label }) => (
                        <span
                            key={value}
                            className="operator"
                            onDoubleClick={() => {
                                onSelect({ value })
                            }}
                        >
                            {label}
                        </span>
                    ))}
                    <span
                        className={'operator'}
                        onDoubleClick={() => {
                            onSelect({
                                value: prompt('Please enter a number', 5),
                            })
                        }}
                    >
                        {i18n.t('<number>')}
                    </span>
                </div>
            </div>
            <style jsx>{styles}</style>
        </>
    )
}

MathOperatorSelector.propTypes = {
    onSelect: PropTypes.func.isRequired,
}

export default MathOperatorSelector
