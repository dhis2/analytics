import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/Operator.style.js'

const Operator = ({ id, label, onDblClick }) => {
    const { attributes, listeners, setNodeRef, transform } = useSortable({
        id,
    })
    const style = {
        // Outputs `translate3d(x, y, 0)`
        transform: CSS.Translate.toString(transform),
    }

    return (
        <>
            <div
                className="operator"
                {...attributes}
                {...listeners}
                ref={setNodeRef}
                style={style}
                onDoubleClick={onDblClick}
            >
                <span>{label}</span>
            </div>
            <style jsx>{styles}</style>
        </>
    )
}

Operator.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    onDblClick: PropTypes.func,
}

export default Operator
