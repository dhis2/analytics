import { useMemo } from 'react'
import { clipPartitionedAxis } from './clipPartitionedAxis'
import { CLIPPED_AXIS_PARTITION_SIZE_PX } from './pivotTableConstants'
import { useScrollPosition } from './useScrollPosition'

export const useTableClipping = ({ containerRef, width, height, engine }) => {
    const scrollPosition = useScrollPosition(containerRef)

    const lineHeight = engine.fontSize + engine.cellPadding * 2 + 2
    const rows = useMemo(() => {
        const headerSize =
            engine.adaptiveClippingController.rows.headerSize +
            (engine.options.title ? lineHeight : 0) +
            (engine.options.subtitle ? lineHeight : 0)
        const viewportPosition = Math.max(0, scrollPosition.y - headerSize)
        const viewportWidth =
            height - Math.max(headerSize - scrollPosition.y, 0)

        return clipPartitionedAxis({
            partitionSize: CLIPPED_AXIS_PARTITION_SIZE_PX,
            partitions: engine.adaptiveClippingController.rows.partitions,
            axisMap: engine.rowMap,
            widthMap: engine.adaptiveClippingController.rows.sizes,
            viewportWidth,
            viewportPosition,
            totalWidth: engine.adaptiveClippingController.rows.totalSize,
        })
    }, [
        scrollPosition.y,
        height,
        lineHeight,
        engine.adaptiveClippingController.rows.headerSize,
        engine.adaptiveClippingController.rows.partitions,
        engine.adaptiveClippingController.rows.sizes,
        engine.adaptiveClippingController.rows.totalSize,
        engine.rowMap,
        engine.options.title,
        engine.options.subtitle,
    ])
    const columns = useMemo(() => {
        const viewportPosition = Math.max(
            0,
            scrollPosition.x -
                engine.adaptiveClippingController.columns.headerSize
        )
        const viewportWidth =
            width -
            Math.max(
                engine.adaptiveClippingController.columns.headerSize -
                    scrollPosition.x,
                0
            )
        return clipPartitionedAxis({
            partitionSize: CLIPPED_AXIS_PARTITION_SIZE_PX,
            partitions: engine.adaptiveClippingController.columns.partitions,
            axisMap: engine.columnMap,
            widthMap: engine.adaptiveClippingController.columns.sizes,
            viewportWidth,
            viewportPosition,
            totalWidth: engine.adaptiveClippingController.columns.totalSize,
        })
    }, [
        scrollPosition.x,
        width,
        engine.adaptiveClippingController.columns.headerSize,
        engine.adaptiveClippingController.columns.partitions,
        engine.adaptiveClippingController.columns.sizes,
        engine.adaptiveClippingController.columns.totalSize,
        engine.columnMap,
    ])

    return {
        rows,
        columns,
        scrollPosition,
    }
}
