import { getHeaderByVis } from '../dimensions.js'
import { layoutGetAllDimensions } from '../layout/layoutGetAllDimensions.js'

// Dimensions saved with program or program stage in an EventVisualization need
// transformation before we can pass them to the pivot table engine

export const transformEventVisualization = (vis) => {
    // Do not modify the original visualization
    const transformedVis = {
        ...vis
    }

    if (vis.columns?.length) {
        transformedVis.columns = [
            ...vis.columns.map((col) => ({
                ...col,
            })),
        ]
    }

    if (vis.rows?.length) {
        transformedVis.rows = [
            ...vis.rows.map((row) => ({
                ...row,
            })),
        ]
    }

    if (vis.filters?.length) {
        transformedVis.filters = [
            ...vis.filters.map((filter) => ({
                ...filter,
            })),
        ]
    }

    let headerName

    layoutGetAllDimensions(transformedVis).forEach((dim) => {
        headerName = getHeaderByVis(dim.dimension)

        if (dim.program?.id) {
            dim.dimension = `${dim.program.id}.${headerName}`
        } else if (dim.programStage?.id) {
            dim.dimension = `${dim.programStage.id}.${headerName}`
        } else {
            dim.dimension = headerName
        }
    })

    return transformedVis
}
