export default function(series) {
    return [
        {
            data: series.map(item => item.data),
            //TODO: This assumes there are exactly 1 dimension on Columns which contains exactly 2 items. This should be supported by a rule.
        },
    ]
}
