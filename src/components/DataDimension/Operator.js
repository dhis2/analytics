import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/Operator.style.js'

const Operator = ({ label, value, index, type, onDoubleClick }) => {
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
                data-test="operator"
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

Operator.propTypes = {
    index: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onDoubleClick: PropTypes.func.isRequired,
}

export default Operator
