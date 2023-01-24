import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import PropTypes from 'prop-types'
import React from 'react'
import { LAST_DROPZONE_ID, FORMULA_BOX_ID } from './CalculationModal.js'
import DropZone from './DropZone.js'
import DraggableFormulaItem from './FormulaItem.js'
import styles from './styles/FormulaField.style.js'

// TODO: Add fn for double-clicking on a part to remove it from the formula
const FormulaField = ({
    expressionArray,
    selectedPart,
    onPartSelection,
    setExpressionItemValue,
}) => {
    const { over, isOver, setNodeRef } = useDroppable({
        id: LAST_DROPZONE_ID,
    })

    const style = {
        opacity: isOver ? 1 : 0.5,
    }

    const overLastDropZone = over?.id === LAST_DROPZONE_ID

    const itemIds = expressionArray.map((item) => item.id)

    function getFormulaItems() {
        return expressionArray.map((item, i) => (
            <DraggableFormulaItem
                key={`${item.label}-${i}`}
                id={item.id}
                index={i}
                label={item.label}
                type={item.type}
                value={item.value}
                onChange={setExpressionItemValue}
                isLast={i === expressionArray.length - 1}
                highlighted={i === selectedPart}
                onClickItem={() => onPartSelection(i)}
            />
        ))
    }

    return (
        <div className="wrapper lastDropZone" ref={setNodeRef} style={style}>
            <SortableContext id={FORMULA_BOX_ID} items={itemIds}>
                <>
                    <DropZone
                        firstElementId={itemIds[0]}
                        overLastDropZone={overLastDropZone}
                    />
                    {getFormulaItems()}
                </>
            </SortableContext>
            <style jsx>{styles}</style>
        </div>
    )
}

FormulaField.propTypes = {
    setExpressionItemValue: PropTypes.func.isRequired,
    expressionArray: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            label: PropTypes.string,
            type: PropTypes.string,
            value: PropTypes.string,
        })
    ),
    selectedPart: PropTypes.number,
    onPartSelection: PropTypes.func,
}

export default FormulaField
