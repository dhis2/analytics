import { separateDigitGroups } from '../../../../../modules/renderValue.js'

export const formatDataLabel = (name = '', y, percentage) => {
    const value = separateDigitGroups(y.toString()).join(' ')
    return (
        '<span style="font-weight:normal">' +
        name +
        '</span><br/>' +
        value +
        '<span style="font-weight:normal"> (' +
        parseFloat(percentage.toFixed(1)) +
        '%)</span>'
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
                padding: 0,
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
