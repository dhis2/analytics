import { getHeaderByVis } from "../dimensions"
import { layoutGetAllDimensions } from "../layout/layoutGetAllDimensions"

export const transformEventVisualization = (vis) => {
    // Do not modify the original visualization
    let transformedVis = {
        ...vis,
        columns: [
            ...vis.columns.map(col => ({
                ...col
            }))
        ],
        rows: [
            ...vis.rows.map(row => ({
                ...row
            }))
        ],
    }

    let headerName

    layoutGetAllDimensions(vis).forEach(dim => {
        headerName = getHeaderByVis(dim.dimension)

        if (dim.program?.id) {
            dim.dimension = `${dim.program.id}.${headerName}`
        }
        else if (dim.programStage?.id) {
            dim.dimension = `${dim.programStage.id}.${headerName}`
        }
        else {
            dim.dimension = headerName
        }
    })
}
