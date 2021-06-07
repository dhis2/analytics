import { useMemo } from 'react'
import { clipAxis } from './clipAxis'
import { clipPartitionedAxis } from './clipPartitionedAxis'
import { COLUMN_PARTITION_SIZE_PX } from './pivotTableConstants'
import { useScrollPosition } from './useScrollPosition'

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
                step: engine.fontSize + engine.cellPadding * 2 + 2,
                totalCount: engine.height,
                headerCount:
                    visualization.columns.length +
                    (engine.options.title ? 1 : 0) +
                    (engine.options.subtitle ? 1 : 0),
            }),
        [
            scrollPosition.y,
            height,
            engine.fontSize,
            engine.cellPadding,
            engine.height,
            engine.options.title,
            engine.options.subtitle,
            visualization.columns.length,
        ]
    )
    const columns = useMemo(() => {
        const viewportPosition = Math.max(
            0,
            scrollPosition.x - engine.rowHeaderPixelWidth
        )
        const viewportWidth =
            width - Math.max(engine.rowHeaderPixelWidth - scrollPosition.x, 0)
        return clipPartitionedAxis({
            partitionSize: COLUMN_PARTITION_SIZE_PX,
            partitions: engine.columnPartitions,
            axisMap: engine.columnMap,
            widthMap: engine.columnWidths,
            viewportWidth,
            viewportPosition,
            totalWidth: engine.dataPixelWidth,
        })
    }, [
        scrollPosition.x,
        engine.rowHeaderPixelWidth,
        engine.columnPartitions,
        engine.columnMap,
        engine.columnWidths,
        engine.dataPixelWidth,
        width,
    ])

    return {
        rows,
        columns,
        scrollPosition,
    }
}
