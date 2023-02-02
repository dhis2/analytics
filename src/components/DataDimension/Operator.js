import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/Operator.style.js'

const Operator = ({ label, onDoubleClick }) => {
    return (
        <>
            <div className="operator" onDoubleClick={onDoubleClick}>
                <span>{label}</span>
            </div>
            <style jsx>{styles}</style>
        </>
    )
}

Operator.propTypes = {
    label: PropTypes.string,
    onDoubleClick: PropTypes.func,
}

Operator.defaultValues = {
    onDoubleClick: Function.prototype,
}

export { Operator }

const DraggableOperator = ({ id, label, type, onDoubleClick }) => {
    const { attributes, listeners, setNodeRef, transform } = useSortable({
        id,
        data: { id, label, type },
    })
    const style = {
        // Outputs `translate3d(x, y, 0)`
        transform: CSS.Translate.toString(transform),
    }

    if (transform) {
        console.log('operator transform', transform)
    }

    return (
        <div {...attributes} {...listeners} ref={setNodeRef} style={style}>
            <Operator
                label={label}
                id={id}
                onDoubleClick={() => onDoubleClick({ id })}
            />
        </div>
    )
}

DraggableOperator.propTypes = {
    onDoubleClick: PropTypes.func.isRequired,
    id: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
}

export default DraggableOperator
