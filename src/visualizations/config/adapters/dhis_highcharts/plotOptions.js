import { VIS_TYPE_SCATTER, VIS_TYPE_BUBBLE } from "../../../../modules/visTypes"

export default ({visType, xAxisName, yAxisName, zAxisName, showLabels}) => {
    switch(visType) {
        case VIS_TYPE_SCATTER: 
            return {
                scatter: {
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: `${xAxisName}: {point.x}<br>${yAxisName}: {point.y}`
                    }
                }
            }
        case VIS_TYPE_BUBBLE:
            return {
                series: {
                    dataLabels: {
                        enabled: showLabels,
                        format: '{point.name}'
                    }
                },
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