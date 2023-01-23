import { useDroppable } from '@dnd-kit/core'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { FIRST_DROPZONE_ID } from './CalculationModal.js'
import styles from './styles/DropZone.style.js'

const DropZone = ({ firstElementId, overLastDropZone }) => {
    const { isOver, setNodeRef, active } = useDroppable({
        id: FIRST_DROPZONE_ID,
    })

    let draggingOver = false
    if (overLastDropZone && !firstElementId) {
        draggingOver = true
    } else {
        draggingOver = firstElementId === active?.id ? false : isOver
    }

    return (
        <div
            ref={setNodeRef}
            className={cx(styles.dropZone, {
                [styles.isOver]: draggingOver,
                [styles.isEmpty]: !firstElementId,
            })}
        ></div>
    )
}

DropZone.propTypes = {
    // axisId: PropTypes.string,
    firstElementId: PropTypes.string,
    overLastDropZone: PropTypes.bool,
}

export default DropZone
