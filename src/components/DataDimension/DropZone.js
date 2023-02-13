import { useDroppable } from '@dnd-kit/core'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/DropZone.style.js'

const DropZone = ({ firstElementId, overLastDropZone }) => {
    const { isOver, setNodeRef, active } = useDroppable({
        id: 'firstdropzone',
    })

    let draggingOver = false
    if (overLastDropZone && !firstElementId) {
        draggingOver = true
    } else {
        draggingOver = firstElementId === active?.id ? false : isOver
    }

    return (
        <>
            <div
                ref={setNodeRef}
                className={cx('first-dropzone', {
                    'dragging-over': draggingOver,
                    empty: !firstElementId,
                })}
            ></div>
            <style jsx>{styles}</style>
        </>
    )
}

DropZone.propTypes = {
    firstElementId: PropTypes.string,
    overLastDropZone: PropTypes.bool,
}

export default DropZone
