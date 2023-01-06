import { getColorByValueFromLegendSet } from '../../../../../modules/legends.js'

export default function (series, colors, legendSet) {
    return [
        {
            colorByPoint: true,
            allowPointSelect: true,
            cursor: 'pointer',
            data: legendSet
                ? series.map((item) => ({
                      ...item,
                      color: getColorByValueFromLegendSet(legendSet, item.y),
                  }))
                : series,
            ...(!legendSet ? { colors: colors } : {}),
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return (
                        '<span style="font-weight:normal">' +
                        this.point.name +
                        '</span><br/>' +
                        this.y +
                        '<span style="font-weight:normal"> (' +
                        this.percentage.toFixed(1) +
                        ' %)</span>'
                    )
                },
            },
            tooltip: {
                headerFormat: '',
                pointFormat:
                    '<span style="color:{point.color}">\u25CF</span> {point.name}: <b>{point.y}</b><br/>',
            },
        },
    ]
}
