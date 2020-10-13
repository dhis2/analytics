const marker = {
    symbol: 'circle'
}

export default function(series, secondCategoryItemNames) {
    if (series.every(item => item.custom) && secondCategoryItemNames) {
        //TODO: This assumes there are exactly 2 dimensions on Columns where the first one contains exactly 3 items. This should be supported by a rule.
        return secondCategoryItemNames.map((category, index) => ({name: category, marker, data: series.filter(item => !item.custom.isTwoCategoryFakeSerie).map(serie => ({values: serie.custom.data.map(item => item[index]), name: serie.name})).map(item => ({x: item.values[0], y: item.values[1], z: item.values[2], name: item.name}))}))
    } else {
        //TODO: This assumes there are exactly 1 dimension on Columns which contains exactly 3 items. This should be supported by a rule.
        return [
            {
                data: series.map(item => ({x: item.data[0], y: item.data[1], z: item.data[2], name: item.name})),
                marker
            },
        ]
    }
}
