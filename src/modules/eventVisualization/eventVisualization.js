import { getHeaderByVis } from '../dimensions.js'
import { layoutGetAllDimensions } from '../layout/layoutGetAllDimensions.js'

// Dimensions saved with program or program stage in an EventVisualization need
// transformation before we can pass them to the pivot table engine

const cloneAxis = (axis) => axis?.map((dim) => ({ ...dim }))

export const transformEventVisualization = (vis) => {
    // Do not modify the original visualization
    const transformedVis = {
        ...vis,
        columns: cloneAxis(vis.columns),
        rows: cloneAxis(vis.rows),
        filters: cloneAxis(vis.filters),
    }

    layoutGetAllDimensions(transformedVis).forEach((dim) => {
        const headerName = getHeaderByVis(dim.dimension)
        const prefix = dim.program?.id ?? dim.programStage?.id

        dim.dimension = prefix ? `${prefix}.${headerName}` : headerName
    })

    return transformedVis
}
