import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import {
    EXPRESSION_TYPE_NUMBER,
    EXPRESSION_TYPE_OPERATOR,
} from '../../../modules/expressions.js'
import draggableChipButtonStyles from './styles/DraggableChipButton.style.js'
import formulaItemStyles from './styles/FormulaItem.style.js'
import styles from './styles/Operator.style.js'

const Operator = ({ label, value, type, onClick }) => {
    const data = { label, value, type }
    const { attributes, listeners, setNodeRef, transform } = useSortable({
        id: `operator-${label}`,
        data,
    })
    const style = {
        transform: CSS.Translate.toString(transform),
    }

    return (
        <button
            type="button"
            className="draggable-item"
            data-drag-chip
            {...attributes}
            {...listeners}
            ref={setNodeRef}
            style={style}
            onClick={() => onClick(data)}
        >
            <div
                className={cx('content', {
                    operator: type === EXPRESSION_TYPE_OPERATOR,
                    number: type === EXPRESSION_TYPE_NUMBER,
                })}
                data-test="operator"
            >
                <span>{label}</span>
            </div>
            <style jsx>{draggableChipButtonStyles}</style>
            <style jsx>{formulaItemStyles}</style>
            <style jsx>{styles}</style>
        </button>
    )
}

Operator.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
}

export default Operator
