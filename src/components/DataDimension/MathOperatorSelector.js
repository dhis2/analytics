import { useSortable } from '@dnd-kit/sortable'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import { TYPE_OPERATOR, TYPE_NUMBER } from './constants.js'
import DraggableOperator from './Operator.js'
import styles from './styles/MathOperatorSelector.style.js'

export const getOperators = () => {
    return [
        { value: '+', label: '+', type: TYPE_OPERATOR },
        { value: '-', label: '-', type: TYPE_OPERATOR },
        { value: '*', label: '×', type: TYPE_OPERATOR },
        { value: '/', label: '/', type: TYPE_OPERATOR },
        { value: '(', label: '(', type: TYPE_OPERATOR },
        { value: ')', label: ')', type: TYPE_OPERATOR },
        {
            value: '',
            label: i18n.t('<number>'),
            type: TYPE_NUMBER,
        },
    ]
}

const MathOperatorSelector = ({ onDoubleClick }) => {
    const { setNodeRef } = useSortable({
        id: 'operators',
    })

    return (
        <>
            <div className="wrapper">
                <h4 className="sub-header">{i18n.t('Math operators')}</h4>
                <div className="operators" ref={setNodeRef}>
                    {getOperators().map(({ type, label, value }, index) => (
                        <DraggableOperator
                            key={`${label}-${index}`}
                            index={index}
                            label={label}
                            value={value}
                            type={type}
                            onDoubleClick={onDoubleClick}
                        />
                    ))}
                </div>
            </div>
            <style jsx>{styles}</style>
        </>
    )
}

MathOperatorSelector.propTypes = {
    onDoubleClick: PropTypes.func.isRequired,
}

export default MathOperatorSelector
