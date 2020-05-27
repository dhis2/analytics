/* eslint-disable max-params */

export default function(series, store, layout, isStacked, colors) {
    return [
        {
            colorByPoint: true,
            allowPointSelect: true,
            cursor: 'pointer',
            data: series,
            colors: colors,
            dataLabels: {
                enabled: true,
                formatter: function() {
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
