import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/Operator.style.js'

const DraggableOperator = ({ id, label, type, onDoubleClick }) => {
    const { attributes, listeners, setNodeRef, transform } = useSortable({
        id,
        data: { id, label, type },
    })
    const style = {
        transform: CSS.Translate.toString(transform),
    }

    return (
        <div {...attributes} {...listeners} ref={setNodeRef} style={style}>
            <div
                className="operator"
                onDoubleClick={() => onDoubleClick({ id })}
            >
                <span>{label}</span>
            </div>
            <style jsx>{styles}</style>
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
