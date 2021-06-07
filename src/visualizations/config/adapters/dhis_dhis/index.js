import getSubtitle from './subtitle'
import getTitle from './title'
import getValue from './value'

export default function ({ store, layout, extraOptions }) {
    const data = store.generateData({
        type: layout.type,
        seriesId:
            layout.columns && layout.columns.length
                ? layout.columns[0].dimension
                : null,
        categoryId:
            layout.rows && layout.rows.length ? layout.rows[0].dimension : null,
    })

    const config = {
        value: data[0] === undefined ? extraOptions.noData.text : data[0],
        formattedValue: getValue(
            data[0],
            layout,
            store.data[0].metaData,
            extraOptions
        ),
        title: getTitle(layout, store.data[0].metaData, extraOptions.dashboard),
        subtitle: getSubtitle(
            layout,
            store.data[0].metaData,
            extraOptions.dashboard
        ),
    }

    return config
}
