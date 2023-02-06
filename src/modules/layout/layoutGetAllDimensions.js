import { layoutGetAllAxes } from './layoutGetAllAxes.js'

export const layoutGetAllDimensions = (layout) =>
    layoutGetAllAxes(layout).reduce((allDimensions, axis) => {
        allDimensions.push(...axis)
        return allDimensions
    }, [])
