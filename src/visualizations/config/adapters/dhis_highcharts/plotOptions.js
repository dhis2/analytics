import { VIS_TYPE_SCATTER } from "../../../../modules/visTypes"

export default ({visType, xAxisName, yAxisName}) => visType === VIS_TYPE_SCATTER ? {
    scatter: {
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: `${xAxisName}: {point.x}<br>${yAxisName}: {point.y}`
        }
    }
} : {}