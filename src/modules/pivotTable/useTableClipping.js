import { useMemo } from 'react'
import { useScrollPosition } from './useScrollPosition'
import { clipAxis } from './clipAxis'
import { CLIPPED_CELL_HEIGHT, COLUMN_PARTITION_SIZE_PX } from './pivotTableConstants'

// const CLIPPING_BUFFER = 100

const clipPartitionedAxis = ({ partitionSize, partitions, widthMap, viewportWidth, viewportPosition, totalWidth} ) => {
    const partition = Math.floor(viewportPosition / partitionSize)

    if (partitions[partition] === undefined) {
        throw new Error('Failed to clip partitioned axis!')
    }

    let start = partitions[partition]
    while (start < widthMap.length && widthMap[start].pre < viewportPosition) {
        ++start
    }
    start = start === 0 ? start : start - 1
    const pre = widthMap[start].pre
    const indices = []
    let end = start
    while (end < widthMap.length && widthMap[end].pre < viewportPosition + viewportWidth) {
        indices.push(end)
        ++end
    }
    end = end === 0 ? end : end - 1
    const post = totalWidth - (widthMap[end].pre + widthMap[end].width)

    return {
        indices,
        pre,
        post
    }
}

export const useTableClipping = ({
    containerRef,
    width,
    height,
    engine,
    visualization,
}) => {
    const scrollPosition = useScrollPosition(containerRef)

    const rows = useMemo(
        () =>
            clipAxis({
                position: scrollPosition.y,
                size: height,
                step: CLIPPED_CELL_HEIGHT,
                totalCount: engine.height,
                headerCount:
                    visualization.columns.length +
                    (engine.options.title ? 1 : 0) +
                    (engine.options.subtitle ? 1 : 0),
            }),
        [
            height,
            engine.height,
            engine.options.title,
            engine.options.subtitle,
            scrollPosition.y,
            visualization.columns.length,
        ]
    )
    const columns = useMemo(
        () => {
            const viewportPosition = Math.max(0, scrollPosition.x - engine.rowHeaderPixelWidth)
            const viewportWidth = width - Math.max(engine.rowHeaderPixelWidth - scrollPosition.x, 0);
            return clipPartitionedAxis({
                partitionSize: COLUMN_PARTITION_SIZE_PX,
                partitions: engine.columnPartitions,
                widthMap: engine.columnWidths,
                viewportWidth,
                viewportPosition,
                totalWidth: engine.dataPixelWidth
            })
        }, [width, engine.columnPartitions, engine.columnWidths, scrollPosition.x, engine.dataPixelWidth, engine.rowHeaderPixelWidth]
    )

    return {
        rows,
        columns,
        scrollPosition,
    }
}
