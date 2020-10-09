export default function(series) {
    return [
        {
            data: series.map(item => item.data),
        },
    ]
}
