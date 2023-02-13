import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useRef, useEffect } from 'react'
import { DIMENSION_TYPE_DATA_ELEMENT } from '../../modules/dataTypes.js'
import { getIcon } from '../../modules/dimensionListItem.js'
import { TYPE_NUMBER, TYPE_DATA_ELEMENT } from '../../modules/expressions.js'
import DragHandleIcon from './DragHandleIcon.js'
import styles from './styles/FormulaItem.style.js'

const BEFORE = 'BEFORE'
const AFTER = 'AFTER'

const maxMsBetweenClicks = 300

const FormulaItem = ({
    id,
    label,
    value = '',
    type,
    isLast,
    isHighlighted,
    overLastDropZone,
    onChange,
    onClick,
    onDoubleClick,
    hasFocus,
}) => {
    const {
        attributes,
        listeners,
        index,
        isDragging,
        over,
        active,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id,
        attributes: { tabIndex: isLast ? -1 : 0 },
        data: { label, type, value, index },
    })

    const inputRef = useRef(null)

    const [clickTimeoutId, setClickTimeoutId] = useState(null)

    useEffect(() => {
        if (hasFocus && inputRef.current) {
            // setTimeout seems to be needed in order for the cursor
            // to remain in the input. Without it, the cursor disappears
            // even though the input still has the focus. Not sure why.
            setTimeout(() => {
                inputRef.current.focus()
            }, 50)
        }
    }, [inputRef, hasFocus])

    const activeIndex = active?.data.current.sortable.index || -1

    const style = transform
        ? {
              transform: active
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

    let insertPosition
    if (over?.id === id) {
        // This item is being hovered over by the item being dragged
        if (activeIndex === -1) {
            //The item being dragged came from the expression options
            // so we will insert after
            insertPosition = AFTER
        } else {
            // The item being dragged is being moved in the formula
            // so if the item is before the item being dragged, use the
            // BEFORE position. Otherwise use the AFTER position
            insertPosition = index > activeIndex ? AFTER : BEFORE
        }
    } else if (isLast && overLastDropZone) {
        insertPosition = AFTER
    }

    const handleClick = (e) => {
        const tagname = e.target.tagName
        clearTimeout(clickTimeoutId)
        const to = setTimeout(function () {
            if (tagname !== 'INPUT') {
                onClick(id)
            } else {
                inputRef.current && inputRef.current.focus()
            }
        }, maxMsBetweenClicks)
        setClickTimeoutId(to)
    }

    const handleDoubleClick = () => {
        clearTimeout(clickTimeoutId)
        setClickTimeoutId(null)
        onDoubleClick(id)
    }

    const handleChange = (e) => onChange({ itemId: id, value: e.target.value })

    const getContent = () => {
        if (type === TYPE_NUMBER) {
            return (
                <>
                    {DragHandleIcon}
                    <span className="input-positioner">
                        <span className="width-machine" aria-hidden="true">
                            {value}
                        </span>
                        <input
                            className="input"
                            id={id}
                            name={label}
                            onChange={handleChange}
                            value={value}
                            type="number"
                            ref={inputRef}
                        />
                    </span>
                    <style jsx>{styles}</style>
                </>
            )
        }

        if (type === TYPE_DATA_ELEMENT) {
            return (
                <>
                    <span className="icon">
                        {getIcon(DIMENSION_TYPE_DATA_ELEMENT)}
                    </span>
                    <span className="data-element-label">{label}</span>
                    <style jsx>{styles}</style>
                </>
            )
        }

        return (
            <>
                <span className="operator-label">{label}</span>
                <style jsx>{styles}</style>
            </>
        )
    }

    return (
        <>
            <div
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                className={cx({ 'last-item': isLast })}
                style={style}
            >
                <div
                    className={cx('formula-item', {
                        inactive: !isDragging,
                        insertBefore: insertPosition === BEFORE,
                        insertAfter: insertPosition === AFTER,
                        highlighted: isHighlighted,
                    })}
                    tabIndex={isLast ? 0 : -1}
                    onClick={handleClick}
                    onDoubleClick={handleDoubleClick}
                >
                    <div className="content">{getContent()}</div>
                </div>
            </div>
            <style jsx>{styles}</style>
        </>
    )
}

FormulaItem.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onDoubleClick: PropTypes.func.isRequired,
    hasFocus: PropTypes.bool,
    isHighlighted: PropTypes.bool,
    isLast: PropTypes.bool,
    overLastDropZone: PropTypes.bool,
    value: PropTypes.string,
}

export default FormulaItem
