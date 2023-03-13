import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PropTypes from 'prop-types'
import React from 'react'
import { getIcon } from '../../modules/dimensionListItem.js'
import { EXPRESSION_TYPE_DATA } from '../../modules/expressions.js'
import { TransferOption } from '../TransferOption.js'
import styles from './styles/DraggableTransferOption.style.js'

const DraggableTransferOption = ({
    label,
    value,
    type,
    disabled,
    onDoubleClick,
}) => {
    const data = { label, value, type: EXPRESSION_TYPE_DATA }
    const { attributes, listeners, setNodeRef, transform } = useSortable({
        id: value,
        data,
        disabled,
    })
    const style = {
        transform: CSS.Translate.toString(transform),
    }

    return (
        <>
            <div
                className="draggable-item"
                {...attributes}
                {...listeners}
                ref={setNodeRef}
                style={style}
            >
                <TransferOption
                    label={label}
                    value={value}
                    icon={getIcon(type)}
                    disabled={disabled}
                    onClick={Function.prototype}
                    onDoubleClick={() => onDoubleClick(data)}
                    dataTest="dimension-option"
                />
            </div>
            <style jsx>{styles}</style>
        </>
    )
}

DraggableTransferOption.propTypes = {
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    onDoubleClick: PropTypes.func,
}

export default DraggableTransferOption
