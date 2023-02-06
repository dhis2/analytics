import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import PropTypes from 'prop-types'
import React from 'react'
import { LAST_DROPZONE_ID, FORMULA_BOX_ID } from './constants.js'
import DropZone from './DropZone.js'
import FormulaItem from './FormulaItem.js'
import styles from './styles/FormulaField.style.js'

const FormulaField = ({
    expressionArray,
    selectedPart,
    highlightItem,
    removeItem,
    setItemValue,
    focusId,
}) => {
    const { over, setNodeRef } = useDroppable({
        id: LAST_DROPZONE_ID,
    })

    const itemIds = expressionArray.map((item) => item.id)

    return (
        <div className="container">
            <div className="border"></div>
            <div className="formulaField lastDropZone" ref={setNodeRef}>
                <SortableContext id={FORMULA_BOX_ID} items={itemIds}>
                    <DropZone
                        firstElementId={itemIds[0]}
                        overLastDropZone={over?.id === LAST_DROPZONE_ID}
                    />
                    {expressionArray.map((item, i) => (
                        <FormulaItem
                            key={`${item.label}-${i}`}
                            id={item.id}
                            index={i}
                            label={item.label}
                            type={item.type}
                            value={item.value}
                            isLast={i === expressionArray.length - 1}
                            hasFocus={focusId === item.id}
                            highlighted={i === selectedPart}
                            onChange={setItemValue}
                            onClick={highlightItem}
                            onDblClick={removeItem}
                        />
                    ))}
                </SortableContext>
            </div>
            <style jsx>{styles}</style>
        </div>
    )
}

FormulaField.propTypes = {
    highlightItem: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    setItemValue: PropTypes.func.isRequired,
    expressionArray: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            label: PropTypes.string,
            type: PropTypes.string,
            value: PropTypes.string,
        })
    ),
    focusId: PropTypes.string,
    selectedPart: PropTypes.number,
}

export default FormulaField
