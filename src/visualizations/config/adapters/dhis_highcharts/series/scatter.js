const marker = {
    symbol: 'circle',
}

export default data => {
    return [
        {
            data: data.map(item => [item.x, item.y]),
            marker,
        },
    ]
}
