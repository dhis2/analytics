import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PropTypes from 'prop-types'
import React from 'react'
import { getIcon, getTooltipText } from '../../modules/dimensionListItem.js'
import { TransferOption } from '../TransferOption.js'
import styles from './styles/Operator.style.js'

const DraggableTransferOption = ({
    label,
    value,
    type,
    disabled,
    onSelect,
}) => {
    const { attributes, listeners, setNodeRef, transform } = useSortable({
        id: value,
        data: { id: value, label, type },
    })
    const style = {
        // Outputs `translate3d(x, y, 0)`
        transform: CSS.Translate.toString(transform),
    }

    return (
        <>
            <div
                className="draggabledataitem"
                {...attributes}
                {...listeners}
                ref={setNodeRef}
                style={style}
            >
                <TransferOption
                    label={label}
                    key={value}
                    value={value}
                    type={type}
                    icon={getIcon(type)}
                    tooltipText={getTooltipText({
                        type,
                    })}
                    disabled={disabled}
                    onDoubleClick={onSelect}
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
    onDblClick: PropTypes.func,
    onSelect: PropTypes.func,
}

export default DraggableTransferOption
