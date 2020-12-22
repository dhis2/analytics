const DEFAULT_COLOR = '#a8bf24'

export default (data, color = DEFAULT_COLOR) => {
    return [
        {
            data: data.map(item => [item.x, item.y]),
            marker: {
                symbol: 'circle',
                fillColor: color,
                lineColor: color,
                radius: 4,
            },
            color,
        },
    ]
}
