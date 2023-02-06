export default function (series, store) {
    const storeData = store.data[0]
    const storeRows = storeData.rows
    const metaDataItems = storeData.metaData.items

    const data = [...new Set(storeRows.map((row) => row[1]))].map((row) => {
        const y = Number(
            (storeRows.find(
                (item) => item.includes(row) && item.includes(series[0].id)
            ) || [])[2]
        )

        const x = Number(
            (storeRows.find(
                (item) => item.includes(row) && item.includes(series[1].id)
            ) || [])[2]
        )

        const name = metaDataItems[row].name

        if (!isNaN(y) && !isNaN(x) && name) {
            return { y, x, name }
        }
    })

    return data.filter((i) => i)
}
