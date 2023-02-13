import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/Operator.style.js'

const DraggableOperator = ({ label, value, index, type, onDoubleClick }) => {
    const { attributes, listeners, setNodeRef, transform } = useSortable({
        id: `operator-${index}`,
        data: { index, value, label, type },
    })
    const style = {
        transform: CSS.Translate.toString(transform),
    }

    return (
        <div {...attributes} {...listeners} ref={setNodeRef} style={style}>
            <div
                className="operator"
                onDoubleClick={() =>
                    onDoubleClick({ index, value, label, type })
                }
            >
                <span>{label}</span>
            </div>
            <style jsx>{styles}</style>
        </div>
    )
}

DraggableOperator.propTypes = {
    index: PropTypes.number.isRequired,
    onDoubleClick: PropTypes.func.isRequired,
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
}

export default DraggableOperator
