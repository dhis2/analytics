import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import { DIMENSION_TYPE_DATA_ELEMENT } from '../../modules/dataTypes.js'
import { getIcon } from '../../modules/dimensionListItem.js'
import { LAST_DROPZONE_ID } from './CalculationModal.js'
import { TYPE_INPUT } from './MathOperatorSelector.js'
import styles from './styles/FormulaItem.style.js'

const BEFORE = 'BEFORE'
const AFTER = 'AFTER'

const itemIsDimension = (item) => item.startsWith('#{') && item.endsWith('}')

const FormulaItem = ({ value, children }) => {
    return (
        <>
            <div
                className={cx('part', {
                    dimension: itemIsDimension(value),
                })}
            >
                {itemIsDimension(value) && (
                    <span className="icon">
                        {getIcon(DIMENSION_TYPE_DATA_ELEMENT)}
                    </span>
                )}
                {children}
            </div>
            <style jsx>{styles}</style>
        </>
    )
}

FormulaItem.propTypes = {
    children: PropTypes.node,
    value: PropTypes.string,
}

export { FormulaItem }

const DraggableFormulaItem = ({
    id,
    label,
    type,
    value = '',
    onChange,
    isLast,
    highlighted,
    // onClickItem,
}) => {
    const [isEditing, setIsEditing] = useState(false)
    const inputRef = useRef(null)
    const spanRef = useRef(null)
    const {
        attributes,
        listeners,
        index,
        isDragging,
        isSorting,
        over,
        active,
        setNodeRef,
        transform,
        transition,
        isOver,
    } = useSortable({
        id,
        data: { id, label, type, value },
    })

    if (isOver) {
        console.log(active?.id, 'is over', over?.id)
    }

    // console.log("item:", name, "isDragging", isDragging, "over:", over);
    // console.log("active", active);
    // console.log("forumulaItemIndex", formulaItemIndex, "index", index);

    const activeIndex = active?.data.current.sortable.index || -1

    const overLastDropZone = over?.id === LAST_DROPZONE_ID
    // console.log("overLastDropZone", overLastDropZone);

    const style = transform
        ? {
              transform: isSorting
                  ? undefined
                  : CSS.Translate.toString({
                        x: transform.x,
                        y: transform.y,
                        scaleX: 1,
                        scaleY: 1,
                    }),
              transition,
          }
        : undefined

    let insertPosition = undefined
    if (over?.id === id) {
        // console.log('index, activeIndex', index, activeIndex)
        // This item is being hovered over by a dragged item
        if (activeIndex === -1) {
            //This item came from the expression options
            insertPosition = AFTER
        } else {
            insertPosition = index > activeIndex ? AFTER : BEFORE
        }
    }

    if (isLast && overLastDropZone) {
        insertPosition = AFTER
    }
    // console.log('insertPosition', insertPosition)

    const getContent = () => {
        if (type === TYPE_INPUT) {
            return (
                <>
                    <input
                        ref={inputRef}
                        style={{ display: 'none' }}
                        onBlur={onInputBlur}
                        onChange={onInputChange}
                        type="text"
                        id={id}
                        name={label}
                        value={value}
                    />
                    <span ref={spanRef} onClick={onClick}>
                        {value || label}
                    </span>
                </>
            )
        } else {
            return <span onClick={onClick}>{value || label}</span>
        }
    }

    const contentClassName = cx('content', {
        active: isDragging,
        insertBefore: insertPosition === BEFORE,
        insertAfter: insertPosition === AFTER,
    })

    // console.log('contentClassName', contentClassName)

    return (
        <>
            <div
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                className={cx('container', { isLast, highlighted })}
                style={style}
            >
                <div className={contentClassName}>
                    <FormulaItem label={label} value={value}>
                        {getContent()}
                    </FormulaItem>
                </div>
            </div>
            <style jsx>{styles}</style>
        </>
    )

    function onClick() {
        if (type === TYPE_INPUT && !isEditing) {
            inputRef.current.style.display = 'inline'
            inputRef.current.focus()
            spanRef.current.style.display = 'none'
            setIsEditing(true)
        }
    }

    function onInputBlur() {
        inputRef.current.style.display = 'none'
        spanRef.current.style.display = 'inline'
        setIsEditing(false)
    }

    function onInputChange(e) {
        onChange({ index, value: e.target.value })
    }
}

DraggableFormulaItem.propTypes = {
    highlighted: PropTypes.bool,
    id: PropTypes.string,
    isLast: PropTypes.bool,
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onClickItem: PropTypes.func,
}

export default DraggableFormulaItem
