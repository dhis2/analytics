import i18n from '../../../../locales/index.js'

import { VIS_TYPE_SCATTER } from '../../../../modules/visTypes'

const MAX_LABELS = 10

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
    const getTooltip = (x, y) => {
        let labels = getLabels(x, y)
        const length = labels.length
        if (length > MAX_LABELS) {
            labels = labels.slice(0, MAX_LABELS)
            labels.push(
                i18n.t('and {{amount}} more...', {
                    amount: length - MAX_LABELS,
                })
            )
        }
        return `${labels
            .map(label => `<b>${label}</b><br>`)
            .join('')}${yAxisName}: ${y}<br>${xAxisName}: ${x}`
    }
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
                    boostThreshold: 1,
                },
            }
        default:
            return {}
    }
}
