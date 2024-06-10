export const formatDataLabel = (name = '', y, percentage) => {
    const spaceSeparatedValue = y
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ') // add space as thousand separator, but also adds it to decimals
    const parts = spaceSeparatedValue.split('.')
    const value = parts[1]
        ? `${parts[0]}.${parts[1].replace(/\s+/g, '')}` // remove spaces from decimals
        : parts[0]
    return (
        '<span style="font-weight:normal">' +
        name +
        '</span><br/>' +
        value +
        '<span style="font-weight:normal"> (' +
        parseFloat(percentage.toFixed(1)) +
        ' %)</span>'
    )
}

export default function (series, colors) {
    return [
        {
            colorByPoint: true,
            allowPointSelect: true,
            cursor: 'pointer',
            data: series,
            colors: colors,
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return formatDataLabel(
                        this.point.name,
                        this.y,
                        this.percentage
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
