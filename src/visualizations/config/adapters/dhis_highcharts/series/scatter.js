const marker = {
    symbol: 'circle',
    fillColor: '#439bf2'
    //TODO: Change to proper marker style
}

export default function(series) {
    return series.map(item => ({name: item.name, data: [item.data], marker}))
    // return [
    //     {
    //         data: series.map(item => item.data),
    //     },
    // ]
}

//TODO: This assumes there are exactly 1 dimension on Columns which contains exactly 2 items. This should be supported by a rule.
