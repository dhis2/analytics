import { Tooltip } from '@dhis2/ui'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useRef, useEffect } from 'react'
import { DIMENSION_TYPE_DATA_ELEMENT } from '../../../modules/dataTypes.js'
import { getIcon } from '../../../modules/dimensionListItem.js'
import {
    EXPRESSION_TYPE_NUMBER,
    EXPRESSION_TYPE_DATA,
} from '../../../modules/expressions.js'
import DragHandleIcon from './DragHandleIcon.js'
import styles from './styles/FormulaItem.style.js'

const BEFORE = 'BEFORE'
const AFTER = 'AFTER'

const maxMsBetweenClicks = 300

const TAG_INPUT = 'INPUT'

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
        data: { label, type, value },
    })

    const inputRef = useRef(null)

    const [clickTimeoutId, setClickTimeoutId] = useState(null)

    useEffect(() => {
        if (hasFocus && inputRef.current) {
            // setTimeout seems to be needed in order for the cursor
            // to remain in the input. Without it, the cursor disappears
            // even though the input still has the focus.
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
            if (tagname !== TAG_INPUT) {
                onClick(id)
            } else {
                inputRef.current && inputRef.current.focus()
            }
        }, maxMsBetweenClicks)
        setClickTimeoutId(to)
    }

    const handleDoubleClick = (e) => {
        clearTimeout(clickTimeoutId)
        setClickTimeoutId(null)
        if (e.target.tagName !== TAG_INPUT) {
            onDoubleClick(id)
        } else {
            inputRef.current && inputRef.current.focus()
        }
    }

    const handleChange = (e) => onChange({ itemId: id, value: e.target.value })

    const getContent = () => {
        if (type === EXPRESSION_TYPE_NUMBER) {
            return (
                <div
                    className={cx('content', 'number', {
                        highlighted: isHighlighted,
                    })}
                >
                    {DragHandleIcon}
                    <span className="number-positioner">
                        <span className="number-width" aria-hidden="true">
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
                </div>
            )
        }

        if (type === EXPRESSION_TYPE_DATA) {
            return (
                <Tooltip content={label} placement="bottom">
                    <div
                        className={cx('content', 'data', {
                            highlighted: isHighlighted,
                        })}
                    >
                        <span className="icon">
                            {getIcon(DIMENSION_TYPE_DATA_ELEMENT)}
                        </span>
                        <span className="label">{label}</span>
                        <style jsx>{styles}</style>
                    </div>
                </Tooltip>
            )
        }

        return (
            <div
                className={cx('content', 'operator', {
                    highlighted: isHighlighted,
                })}
            >
                <span className="label">{label}</span>
                <style jsx>{styles}</style>
            </div>
        )
    }

    return (
        <>
            <div
                ref={setNodeRef}
                className={cx({ 'last-item': isLast })}
                style={style}
            >
                <div
                    {...attributes}
                    {...listeners}
                    className={cx('formula-item', {
                        inactive: !isDragging,
                        insertBefore: insertPosition === BEFORE,
                        insertAfter: insertPosition === AFTER,
                    })}
                    onClick={handleClick}
                    onDoubleClick={handleDoubleClick}
                    data-test={`formula-item-${id}`}
                >
                    {getContent()}
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
