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
    onPartSelection,
    setExpressionItemValue,
}) => {
    const { over, setNodeRef } = useDroppable({
        id: LAST_DROPZONE_ID,
    })

    const overLastDropZone = over?.id === LAST_DROPZONE_ID

    const itemIds = expressionArray.map((item) => item.id)

    return (
        <div className="formulaField lastDropZone" ref={setNodeRef}>
            <SortableContext id={FORMULA_BOX_ID} items={itemIds}>
                <>
                    <DropZone
                        firstElementId={itemIds[0]}
                        overLastDropZone={overLastDropZone}
                    />
                    {expressionArray.map((item, i) => (
                        <FormulaItem
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
                    ))}
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
