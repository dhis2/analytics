import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/Operator.style.js'

const Operator = ({ label, onClick }) => {
    return (
        <>
            <div className="operator" onClick={onClick}>
                <span>{label}</span>
            </div>
            <style jsx>{styles}</style>
        </>
    )
}

Operator.propTypes = {
    label: PropTypes.string,
    onClick: PropTypes.func,
}

Operator.defaultProps = {
    onClick: Function.prototype,
}

export { Operator }

const DraggableOperator = ({ id, label, type, onClick }) => {
    const { attributes, listeners, setNodeRef, transform } = useSortable({
        id,
        data: { id, label, type },
    })
    const style = {
        // Outputs `translate3d(x, y, 0)`
        transform: CSS.Translate.toString(transform),
    }

    return (
        <div {...attributes} {...listeners} ref={setNodeRef} style={style}>
            <Operator label={label} onClick={() => onClick({ id, label })} />
        </div>
    )
}

DraggableOperator.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    onClick: PropTypes.func,
}

export default DraggableOperator
