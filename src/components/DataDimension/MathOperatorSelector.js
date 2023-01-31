import { useSortable } from '@dnd-kit/sortable'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import { TYPE_OPERATOR, TYPE_INPUT } from './constants.js'
import DraggableOperator from './Operator.js'
import styles from './styles/MathOperatorSelector.style.js'

export const getOperators = () => {
    return [
        { id: 'plus', value: '+', label: '+', type: TYPE_OPERATOR },
        { id: 'minus', value: '-', label: '-', type: TYPE_OPERATOR },
        { id: 'multiply', value: 'x', label: 'x', type: TYPE_OPERATOR },
        { id: 'divide', value: '/', label: '/', type: TYPE_OPERATOR },
        { id: 'openpar', value: '(', label: '(', type: TYPE_OPERATOR },
        { id: 'closepar', value: ')', label: ')', type: TYPE_OPERATOR },
        {
            id: 'number',
            value: '',
            label: i18n.t('<number>'),
            type: TYPE_INPUT,
        },
    ]
}

const MathOperatorSelector = ({ onSelect }) => {
    const { setNodeRef } = useSortable({
        id: 'operators',
    })

    return (
        <>
            <div className="wrapper">
                <h4 className="sub-header">{i18n.t('Math operators')}</h4>
                <div className="operators" ref={setNodeRef}>
                    {getOperators().map(({ id, value, type, label }) => (
                        <DraggableOperator
                            key={id}
                            id={id}
                            label={label}
                            type={type}
                            value={value}
                            onClick={onSelect}
                        />
                    ))}
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
