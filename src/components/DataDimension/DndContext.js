import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
} from '@dnd-kit/core'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import DraggingItem from './DraggingItem.js'

export const OPTIONS_PANEL = 'Sortable'

const OuterDndContext = ({ children, onDragEnd, onDragStart }) => {
    const [draggingItem, setDraggingItem] = useState(null)
    const sensor = useSensor(PointerSensor, {
        activationConstraint: {
            distance: 15,
        },
    })
    const sensors = useSensors(sensor)

    return (
        <DndContext
            collisionDetection={rectIntersectionCustom}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            sensors={sensors}
        >
            {children}
            <DragOverlay dropAnimation={null}>
                {draggingItem ? (
                    <span className="dragOverlay">
                        <DraggingItem {...draggingItem} />
                    </span>
                ) : null}
            </DragOverlay>
        </DndContext>
    )

    function handleDragStart({ active }) {
        setDraggingItem(active.data.current)
        onDragStart && onDragStart()
    }

    function handleDragCancel() {
        setDraggingItem(null)
    }

    function handleDragEnd({ active, over }) {
        if (
            !over?.id ||
            over?.data?.current?.sortable?.containerId === OPTIONS_PANEL ||
            !active.data.current
        ) {
            // dropped over non-droppable or over options panel
            handleDragCancel()
            return
        }

        const item = {
            id: active.id,
            sourceContainerId: active.data.current.sortable.containerId,
            sourceIndex: active.data.current.sortable.index,
            data: {
                index: active.data.current.index,
                label: active.data.current.label,
                value: active.data.current.value,
                type: active.data.current.type,
            },
        }
        const destination = {
            containerId: over.data.current?.sortable.containerId || over.id,
            index: over.data.current?.sortable.index,
        }

        onDragEnd({ item, destination })
        setDraggingItem(null)
    }

    function getIntersectionRatio(entry, target) {
        const top = Math.max(target.top, entry.top)
        const left = Math.max(target.left, entry.left)
        const right = Math.min(
            target.left + target.width,
            entry.left + entry.width
        )
        const bottom = Math.min(
            target.top + target.height,
            entry.top + entry.height
        )
        const width = right - left
        const height = bottom - top

        if (left < right && top < bottom) {
            const targetArea = target.width * target.height
            const entryArea = entry.width * entry.height
            const intersectionArea = width * height
            const intersectionRatio =
                intersectionArea / (targetArea + entryArea - intersectionArea)
            return Number(intersectionRatio.toFixed(4))
        } // Rectangles do not overlap, or overlap has an area of zero (edge/corner overlap)

        return 0
    }
    function sortCollisionsDesc(
        { data: { value: a } },
        { data: { value: b } }
    ) {
        return b - a
    }

    function rectIntersectionCustom({
        pointerCoordinates,
        droppableContainers,
    }) {
        // create a rect around the pointerCoords for calculating the intersection

        const pointerRectWidth = 40
        const pointerRectHeight = 40
        const pointerRect = {
            width: pointerRectWidth,
            height: pointerRectHeight,
            top: pointerCoordinates.y - pointerRectHeight / 2,
            bottom: pointerCoordinates.y + pointerRectHeight / 2,
            left: pointerCoordinates.x - pointerRectWidth / 2,
            right: pointerCoordinates.x + pointerRectWidth / 2,
        }
        const collisions = []

        for (const droppableContainer of droppableContainers) {
            const {
                id,
                rect: { current: rect },
            } = droppableContainer

            if (rect) {
                const intersectionRatio = getIntersectionRatio(
                    rect,
                    pointerRect
                )

                if (intersectionRatio > 0) {
                    collisions.push({
                        id,
                        data: {
                            droppableContainer,
                            value: intersectionRatio,
                        },
                    })
                }
            }
        }

        return collisions.sort(sortCollisionsDesc)
    }
}

OuterDndContext.propTypes = {
    onDragEnd: PropTypes.func.isRequired,
    children: PropTypes.node,
    onDragStart: PropTypes.func,
}

export default OuterDndContext
