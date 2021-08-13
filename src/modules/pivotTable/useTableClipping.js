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
                    (engine.options.title && !engine.options.fixedColumnHeaders
                        ? 1
                        : 0) +
                    (engine.options.subtitle &&
                    !engine.options.fixedColumnHeaders
                        ? 1
                        : 0),
            }),
        [
            scrollPosition.y,
            height,
            engine.fontSize,
            engine.cellPadding,
            engine.height,
            engine.options.title,
            engine.options.subtitle,
            engine.options.fixedColumnHeaders,
            visualization.columns.length,
        ]
    )
    const columns = useMemo(() => {
        const viewportPosition = Math.max(
            0,
            engine.options.fixedRowHeaders
                ? scrollPosition.x
                : scrollPosition.x - engine.rowHeaderPixelWidth
        )
        const viewportWidth =
            width -
            (engine.options.fixedRowHeaders
                ? engine.rowHeaderPixelWidth
                : Math.max(engine.rowHeaderPixelWidth - scrollPosition.x, 0))

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
        engine.options.fixedRowHeaders,
        width,
    ])

    return {
        rows,
        columns,
        scrollPosition,
    }
}
