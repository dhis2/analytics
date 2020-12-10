export default function (series, store) {
    return [...new Set(store.data[0].rows.map(row => row[1]))]
        .filter(
            row =>
                store.data[0].rows.filter(
                    item => item.includes(row) && item.includes(series[0].id)
                )[0] &&
                store.data[0].rows.filter(
                    item => item.includes(row) && item.includes(series[1].id)
                )[0]
        )
        .map(row => ({
            name: store.data[0].metaData.items[row].name,
            y: Number(
                store.data[0].rows.filter(
                    item => item.includes(row) && item.includes(series[0].id)
                )[0][2]
            ),
            x: Number(
                store.data[0].rows.filter(
                    item => item.includes(row) && item.includes(series[1].id)
                )[0][2]
            ),
        }))
}
