import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import { LAST_DROPZONE_ID } from './CalculationModal.js'
import styles from './styles/FormulaItem.style.js'

const BEFORE = 'BEFORE'
const AFTER = 'AFTER'

const FormulaItem = ({ id, label, type, value = '', onChange, isLast }) => {
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
    } = useSortable({
        id,
    })

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
        console.log('index, activeIndex', index, activeIndex)
        // This formulaItem is being hovered over by a dragged item
        if (activeIndex === -1) {
            //This item came from the dimensions panel
            insertPosition = AFTER
        } else {
            insertPosition = index > activeIndex ? AFTER : BEFORE
        }
        console.log('insertPosition', insertPosition)
    }

    if (isLast && overLastDropZone) {
        insertPosition = AFTER
    }

    const onClick = () => {
        if (type === 'input' && !isEditing) {
            inputRef.current.style.display = 'inline'
            inputRef.current.focus()
            spanRef.current.style.display = 'none'
            setIsEditing(true)
        }
    }

    const onInputBlur = () => {
        inputRef.current.style.display = 'none'
        spanRef.current.style.display = 'inline'
        setIsEditing(false)
    }

    const onInputChange = (e) => {
        onChange({ index, value: e.target.value })
    }

    const getContent = () => {
        if (type === 'input') {
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

    const contentClassName = cx(styles.content, {
        [styles.active]: isDragging,
        [styles.insertBefore]: insertPosition === BEFORE,
        [styles.insertAfter]: insertPosition === AFTER,
    })

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className={isLast ? styles.isLast : null}
            style={style}
        >
            <div className="part">
                <div className={contentClassName}>{getContent()}</div>
            </div>
            <style jsx>{styles}</style>
        </div>
    )
}

export default FormulaItem

FormulaItem.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
    isLast: PropTypes.bool,
}

//<>
//             <span
//                 className={cx('part', {
//                     dimension: partIsDimension(part.value),
//                 })}
//                 key={index}
//             >
//                 {partIsDimension(part.value) && (
//                     <span className="icon">
//                         {getIcon(DIMENSION_TYPE_DATA_ELEMENT)}
//                     </span>
//                 )}
//                 {part.label}
//             </span>
//             <style jsx>{styles}</style>
//         </>
