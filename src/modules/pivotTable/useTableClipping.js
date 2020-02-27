import { useMemo } from 'react'
import { useScrollPosition } from './useScrollPosition'
import { clipAxis } from './clipAxis'
import { CLIPPED_CELL_WIDTH, CLIPPED_CELL_HEIGHT } from './pivotTableConstants'

// const CLIPPING_BUFFER = 100

export const useTableClipping = ({
    containerRef,
    width,
    height,
    engine,
    visualization,
}) => {
    const scrollPosition = useScrollPosition(containerRef)
    // TODO
    // const rowStart = engine.columnMap.findIndex(idx => engine.columnWidths[idx].pre > scrollPosition.x - CLIPPING_BUFFER)
    // if (rowStart === -1) {
    //     // No valid start found...
    //     throw new Error();
    // }
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
        () =>
            clipAxis({
                position: scrollPosition.x,
                size: width,
                step: CLIPPED_CELL_WIDTH,
                totalCount: engine.width,
                headerCount: visualization.rows.length,
            }),
        [width, engine.width, scrollPosition.x, visualization.rows.length]
    )

    return {
        rows,
        columns,
        scrollPosition,
    }
}
