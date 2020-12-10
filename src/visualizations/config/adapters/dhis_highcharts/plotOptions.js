import { VIS_TYPE_SCATTER } from '../../../../modules/visTypes'

export default ({ visType, xAxisName, yAxisName, showLabels, tooltipData }) => {
    const series = {
        dataLabels: {
            enabled: showLabels,
            format: '{point.name}',
        },
    }
    const getLabels = (x, y) =>
        tooltipData
            .filter(item => item.x === x && item.y === y)
            .map(item => item.name)
    const getTooltip = (x, y) =>
        `${getLabels(x, y)
            .map(label => `<b>${label}</b><br>`)
            .join('')}${yAxisName}: ${y}<br>${xAxisName}: ${x}`
    switch (visType) {
        case VIS_TYPE_SCATTER:
            return {
                series,
                scatter: {
                    tooltip: {
                        useHTML: true,
                        headerFormat: '',
                        pointFormatter: function () {
                            return getTooltip(this.x, this.y)
                        },
                    },
                },
            }
        default:
            return {}
    }
}
