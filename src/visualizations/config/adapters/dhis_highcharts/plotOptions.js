import { VIS_TYPE_SCATTER } from '../../../../modules/visTypes'

export default ({ visType, xAxisName, yAxisName, showLabels }) => {
    const series = {
        dataLabels: {
            enabled: showLabels,
            format: '{point.name}',
        },
    }
    switch (visType) {
        case VIS_TYPE_SCATTER:
            return {
                series,
                scatter: {
                    tooltip: {
                        useHTML: true,
                        headerFormat: '',
                        pointFormat:
                            `<b>{point.name}</b><br>` +
                            `${yAxisName}: {point.y}<br>${xAxisName}: {point.x}`,
                    },
                },
            }
        default:
            return {}
    }
}
