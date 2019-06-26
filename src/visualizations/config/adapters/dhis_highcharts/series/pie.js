export default function(series, store, layout, isStacked, colors) {
    return [
        {
            name: series[0].name,
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
        },
    ]
}
