const marker = {
    symbol: 'circle'
}

export default function(series) {
    return series.map(item => ({name: item.name, data: [{x: item.data[0], y: item.data[1], z: item.data[2]}], marker}))
}

//TODO: This assumes there are exactly 1 dimension on Columns which contains exactly 3 items. This should be supported by a rule.
