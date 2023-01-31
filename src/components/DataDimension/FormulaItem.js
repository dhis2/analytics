import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { DIMENSION_TYPE_DATA_ELEMENT } from '../../modules/dataTypes.js'
import { getIcon } from '../../modules/dimensionListItem.js'
import { TYPE_INPUT, TYPE_DATAITEM, LAST_DROPZONE_ID } from './constants.js'
import DragHandleIcon from './DragHandleIcon.js'
import styles from './styles/FormulaItem.style.js'

const BEFORE = 'BEFORE'
const AFTER = 'AFTER'

const FormulaItem = ({ type, children }) => {
    return (
        <>
            <div className="chip">
                {type === TYPE_DATAITEM && (
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
    type: PropTypes.string,
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
        data: { id, label, type, value },
    })

    const activeIndex = active?.data.current.sortable.index || -1

    const overLastDropZone = over?.id === LAST_DROPZONE_ID

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
        // This item is being hovered over by the item being dragged
        if (activeIndex === -1) {
            //The item being dragged came from the expression options
            // so we will insert after
            insertPosition = AFTER
        } else {
            // The item being dragged is being moved from the formula
            // so if the item is before the item being dragged, use the
            // BEFORE position. Otherwise use the AFTER position
            insertPosition = index > activeIndex ? AFTER : BEFORE
        }
    }

    if (isLast && overLastDropZone) {
        insertPosition = AFTER
    }

    const chipClasses = cx('chip', {
        inactive: !isDragging,
        insertBefore: insertPosition === BEFORE,
        insertAfter: insertPosition === AFTER,
        highlighted,
    })

    if (type === TYPE_INPUT) {
        return (
            <>
                <div className={cx('inputwrapper', { isLast })}>
                    <div className={chipClasses}>
                        <div className="content">
                            <div
                                ref={setNodeRef}
                                {...attributes}
                                {...listeners}
                                className="dndHandle"
                            >
                                {DragHandleIcon}
                            </div>
                            <span className="inputWrap">
                                <span
                                    className="widthMachine"
                                    aria-hidden="true"
                                >
                                    {value}
                                </span>
                                <input
                                    id={id}
                                    name={label}
                                    onChange={onInputChange}
                                    className="input"
                                    value={value}
                                    type="number"
                                />
                            </span>
                        </div>
                    </div>
                </div>
                <style jsx>{styles}</style>
            </>
        )
    } else if (type === TYPE_DATAITEM) {
        return (
            <>
                <div
                    ref={setNodeRef}
                    {...attributes}
                    {...listeners}
                    className="dnd"
                    style={style}
                >
                    <div className={chipClasses}>
                        <div className="content dataitem">
                            <span className="icon">
                                {getIcon(DIMENSION_TYPE_DATA_ELEMENT)}
                            </span>
                            <span className="label">{label || value}</span>
                        </div>
                    </div>
                    <style jsx>{styles}</style>
                </div>
            </>
        )
    } else {
        return (
            <>
                <div
                    ref={setNodeRef}
                    {...attributes}
                    {...listeners}
                    className={cx('dnd', { isLast })}
                    style={style}
                >
                    <div className={chipClasses}>
                        <div className="content operator">
                            <span className="label">{value || label}</span>
                        </div>
                    </div>
                </div>
                <style jsx>{styles}</style>
            </>
        )
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
