const DEFAULT_COLOR = '#a8bf24'

export default data => {
    return [
        {
            data: data.map(item => [item.x, item.y]),
            marker: {
                symbol: 'circle',
                fillColor: DEFAULT_COLOR,
                lineColor: DEFAULT_COLOR,
                radius: 4,
            },
            color: DEFAULT_COLOR,
        },
    ]
}
