import { useMemo } from 'react'
import { useScrollPosition } from './useScrollPosition'
import { clipAxis } from './clipAxis'

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
                step: 25,
                totalCount: engine.height,
                headerCount: visualization.columns.length,
            }),
        [height, engine.height, scrollPosition.y, visualization.columns.length]
    )
    const columns = useMemo(
        () =>
            clipAxis({
                position: scrollPosition.x,
                size: width,
                step: 150,
                totalCount: engine.width,
                headerCount: visualization.rows.length,
            }),
        [width, engine.width, scrollPosition.x, visualization.rows.length]
    )

    return {
        rows,
        columns,
    }
}
