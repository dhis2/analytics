import { layoutGetAllAxes } from './layoutGetAllAxes'

export const layoutGetAllDimensions = layout =>
    layoutGetAllAxes(layout).reduce((allDimensions, axis) => {
        allDimensions.push(...axis)
        return allDimensions
    }, [])
