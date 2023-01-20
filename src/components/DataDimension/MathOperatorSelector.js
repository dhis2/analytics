import React from 'react'
import i18n from '../../locales/index.js'
import styles from './styles/MathOperatorSelector.style.js'

const MathOperatorSelector = () => {
    const operators = ['+', '-', '×', '/', '(', ')']
    return (
        <>
            <div className="wrapper">
                <h4 className="sub-header">{i18n.t('Math operators')}</h4>
                <div className="operators">
                    {operators.map((operator, index) => (
                        <span key={index} className="operator">
                            {operator}
                        </span>
                    ))}
                    <span className={'operator'}>{i18n.t('<number>')}</span>
                </div>
            </div>
            <style jsx>{styles}</style>
        </>
    )
}

export default MathOperatorSelector
