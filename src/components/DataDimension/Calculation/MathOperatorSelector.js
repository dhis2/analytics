import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../locales/index.js'
import { getOperators } from '../../../modules/expressions.js'
import DraggableOperator from './Operator.js'
import styles from './styles/MathOperatorSelector.style.js'

const MathOperatorSelector = ({ onDoubleClick }) => (
    <>
        <div className="wrapper">
            <h4 className="sub-header">{i18n.t('Math operators')}</h4>
            <div className="operators" data-test={'operators-list'}>
                {getOperators().map(({ label, value, type }, index) => (
                    <DraggableOperator
                        key={`${label}-${index}`}
                        label={label}
                        value={value}
                        type={type}
                        index={index}
                        onDoubleClick={onDoubleClick}
                    />
                ))}
            </div>
        </div>
        <style jsx>{styles}</style>
    </>
)

MathOperatorSelector.propTypes = {
    onDoubleClick: PropTypes.func.isRequired,
}

export default MathOperatorSelector
