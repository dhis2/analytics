import { useSortable } from '@dnd-kit/sortable'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import Operator from './Operator.js'
import styles from './styles/MathOperatorSelector.style.js'

const TYPE_INPUT = 'input'
const TYPE_OPERATOR = 'operator'

// const itemTypes = [
//     { id: 'plus', class: 'plus', name: '+', type: TYPE_OPERATOR },
//     { id: 'minus', class: 'minus', name: '-', type: TYPE_OPERATOR },
//     { id: 'div', class: 'div', name: '/', type: TYPE_OPERATOR },
//     { id: 'mult', class: 'mult', name: '*', type: TYPE_OPERATOR },
//     { id: 'openpar', class: 'openpar', name: '(', type: TYPE_OPERATOR },
//     { id: 'closepar', class: 'closepar', name: ')', type: TYPE_OPERATOR },
//     { id: 'num', class: 'num', name: '<number>', type: TYPE_INPUT },
// ]

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

    const internalOnSelect = (val) => {
        console.log('selected', val)
        // onSelect()
    }

    return (
        <>
            <div className="wrapper">
                <h4 className="sub-header">{i18n.t('Math operators')}</h4>
                <div className="operators" ref={setNodeRef} style={style}>
                    {getOperators().map(({ id, value, label }) => (
                        <Operator
                            key={id}
                            id={id}
                            label={label}
                            value={value}
                            onDblClick={internalOnSelect}
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
