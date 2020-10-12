import { VIS_TYPE_SCATTER, VIS_TYPE_BUBBLE } from "../../../../modules/visTypes"

export default ({visType, xAxisName, yAxisName, zAxisName, showLabels}) => {
    const series = { 
        dataLabels: {
            enabled: showLabels,
            format: '{point.name}'
        }
    }
    switch(visType) {
        case VIS_TYPE_SCATTER: 
            return {
                series,
                scatter: {
                    tooltip: {
                        useHTML: true,
                        headerFormat: '',
                        pointFormat: `<b>{point.name}</b><br>` +  
                            `${xAxisName}: {point.x}<br>${yAxisName}: {point.y}`
                    }
                }
            }
        case VIS_TYPE_BUBBLE:
            return {
                series,
                bubble: {
                    tooltip: {
                        useHTML: true,
                        headerFormat: '',
                        pointFormat: `<b>{point.name}</b><br>` +  
                            `${xAxisName}: {point.x}<br>` +
                            `${yAxisName}: {point.y}<br>` +
                            `${zAxisName}: {point.z}`,
                        followPointer: true
                    },
                }
            }
        default:
            return {}
    }
}