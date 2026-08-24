import PropTypes from 'prop-types'
import React from 'react'
import { getOperators } from '../../../modules/expressions.js'
import DraggableOperator from './Operator.js'
import styles from './styles/MathOperatorSelector.style.js'

const OPERATORS = getOperators()

const MathOperatorSelector = ({ onClick }) => (
    <>
        <div className="operators" data-test="operators-list">
            {OPERATORS.map(({ label, value, type }, index) => (
                <DraggableOperator
                    key={`${label}-${index}`}
                    label={label}
                    value={value}
                    type={type}
                    index={index}
                    onClick={onClick}
                />
            ))}
        </div>
        <style jsx>{styles}</style>
    </>
)

MathOperatorSelector.propTypes = {
    onClick: PropTypes.func.isRequired,
}

export default MathOperatorSelector
