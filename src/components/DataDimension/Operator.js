import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import {
    EXPRESSION_TYPE_NUMBER,
    EXPRESSION_TYPE_OPERATOR,
} from '../../modules/expressions.js'
import formulaItemStyles from './styles/FormulaItem.style.js'
import styles from './styles/Operator.style.js'

const Operator = ({ label, value, type, onDoubleClick }) => {
    const { attributes, listeners, setNodeRef, transform } = useSortable({
        id: `operator-${label}`,
        data: { label, value, type },
    })
    const style = {
        transform: CSS.Translate.toString(transform),
    }

    return (
        <div {...attributes} {...listeners} ref={setNodeRef} style={style}>
            <div
                className={cx('content', {
                    operator: type === EXPRESSION_TYPE_OPERATOR,
                    number: type === EXPRESSION_TYPE_NUMBER,
                })}
                data-test="operator"
                onDoubleClick={() => onDoubleClick({ label, value, type })}
            >
                <span>{label}</span>
            </div>
            <style jsx>{styles}</style>
            <style jsx>{formulaItemStyles}</style>
        </div>
    )
}

Operator.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onDoubleClick: PropTypes.func.isRequired,
}

export default Operator
