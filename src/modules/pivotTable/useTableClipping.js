import { useMemo } from 'react'
import { useScrollPosition } from './useScrollPosition'
import { clipAxis } from './clipAxis'
import times from 'lodash/times'
import {
    CLIPPED_CELL_WIDTH,
    CLIPPED_CELL_HEIGHT,
    CLIPPING_TABLE_MIN_SIZE,
} from './pivotTableConstants'

export const useTableClipping = ({
    containerRef,
    width,
    height,
    engine,
    visualization,
}) => {
    const scrollPosition = useScrollPosition(containerRef)

    const clippingEnabled = engine.size >= CLIPPING_TABLE_MIN_SIZE

    const rows = useMemo(
        () =>
            clippingEnabled
                ? clipAxis({
                      position: scrollPosition.y,
                      size: height,
                      step: CLIPPED_CELL_HEIGHT,
                      totalCount: engine.height,
                      headerCount:
                          visualization.columns.length +
                          (engine.options.title ? 1 : 0) +
                          (engine.options.subtitle ? 1 : 0),
                  })
                : null,
        [
            clippingEnabled,
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
            clippingEnabled
                ? clipAxis({
                      position: scrollPosition.x,
                      size: width,
                      step: CLIPPED_CELL_WIDTH,
                      totalCount: engine.width,
                      headerCount: visualization.rows.length,
                  })
                : null,
        [
            clippingEnabled,
            width,
            engine.width,
            scrollPosition.x,
            visualization.rows.length,
        ]
    )

    if (!clippingEnabled) {
        return {
            rows: {
                indices: times(engine.height, n => n),
                pre: 0,
                post: 0,
            },
            columns: {
                indices: times(engine.width, n => n),
                pre: 0,
                post: 0,
            },
            scrollPosition,
            clipped: false,
        }
    }

    return {
        rows,
        columns,
        scrollPosition,
        clipped: true,
    }
}
