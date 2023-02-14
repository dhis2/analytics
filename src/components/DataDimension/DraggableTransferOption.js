import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PropTypes from 'prop-types'
import React from 'react'
import { getIcon, getTooltipText } from '../../modules/dimensionListItem.js'
import { TransferOption } from '../TransferOption.js'
import styles from './styles/DraggableTransferOption.style.js'

const DraggableTransferOption = ({
    label,
    value,
    type,
    disabled,
    onDoubleClick,
}) => {
    const { attributes, listeners, setNodeRef, transform } = useSortable({
        id: value,
        data: { value, label, type, index: -1 },
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
                    key={value}
                    value={value}
                    type={type}
                    icon={getIcon(type)}
                    tooltipText={getTooltipText({
                        type,
                    })}
                    disabled={disabled}
                    onClick={Function.prototype}
                    onDoubleClick={({ label, value }) =>
                        onDoubleClick({ label, value, type })
                    }
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
