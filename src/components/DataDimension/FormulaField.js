import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import PropTypes from 'prop-types'
import React from 'react'
import { LAST_DROPZONE_ID, FORMULA_BOX_ID } from './constants.js'
import DropZone from './DropZone.js'
import FormulaItem from './FormulaItem.js'
import styles from './styles/FormulaField.style.js'

const FormulaField = ({
    items,
    selectedItemId,
    focusItemId,
    onChange,
    onClick,
    onDoubleClick,
}) => {
    const { over, setNodeRef: setLastDropzoneRef } = useDroppable({
        id: LAST_DROPZONE_ID,
    })

    const itemIds = items.map((item) => item.id)

    return (
        <div className="container">
            <div className="border"></div>
            <div className="formula-field" ref={setLastDropzoneRef}>
                <SortableContext id={FORMULA_BOX_ID} items={itemIds}>
                    <DropZone
                        firstElementId={itemIds[0]}
                        overLastDropZone={over?.id === LAST_DROPZONE_ID}
                    />
                    {items.map(({ id, label, type, value }, index) => (
                        <FormulaItem
                            key={id}
                            id={id}
                            label={label}
                            type={type}
                            value={value}
                            hasFocus={focusItemId === id}
                            isHighlighted={selectedItemId === id}
                            isLast={index === items.length - 1}
                            onChange={onChange}
                            onClick={onClick}
                            onDoubleClick={onDoubleClick}
                        />
                    ))}
                </SortableContext>
            </div>
            <style jsx>{styles}</style>
        </div>
    )
}

FormulaField.propTypes = {
    onChange: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onDoubleClick: PropTypes.func.isRequired,
    focusItemId: PropTypes.string,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            label: PropTypes.string,
            type: PropTypes.string,
            value: PropTypes.string,
        })
    ),
    selectedItemId: PropTypes.string,
}

export default FormulaField
