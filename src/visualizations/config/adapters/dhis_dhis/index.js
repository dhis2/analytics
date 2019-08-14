import getTitle from './title'
import getSubtitle from './subtitle'

export default function({ store, layout, extraOptions }) {
    const data = store.generateData({
        type: layout.type,
        seriesId:
            layout.columns && layout.columns.length
                ? layout.columns[0].dimension
                : null,
        categoryId:
            layout.rows && layout.rows.length ? layout.rows[0].dimension : null,
    })

    const value = data[0] === undefined ? extraOptions.noData.text : data[0]

    const config = {
        value: value,
        title: getTitle(layout, store.data[0].metaData, extraOptions.dashboard),
        subtitle: getSubtitle(
            layout,
            store.data[0].metaData,
            extraOptions.dashboard
        ),
    }

    return config
}
