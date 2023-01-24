import { useSortable } from '@dnd-kit/sortable'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import DraggableOperator from './Operator.js'
import styles from './styles/MathOperatorSelector.style.js'

export const TYPE_INPUT = 'input'
export const TYPE_OPERATOR = 'operator'
export const TYPE_DATAITEM = 'dataitem'

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
    const { isOver, setNodeRef } = useSortable({
        id: 'operators',
    })
    const style = {
        opacity: isOver ? 1 : 0.5,
    }

    return (
        <>
            <div className="wrapper">
                <h4 className="sub-header">{i18n.t('Math operators')}</h4>
                <div className="operators" ref={setNodeRef} style={style}>
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
