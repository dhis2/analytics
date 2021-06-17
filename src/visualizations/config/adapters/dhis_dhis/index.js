import getSubtitle from './subtitle'
import getTitle from './title'
import getValue from './value'

export const INDICATOR_FACTOR_100 = 100

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
    const metaData = store.data[0].metaData

    const config = {
        value: data[0] === undefined ? extraOptions.noData.text : data[0],
        formattedValue: getValue(data[0], layout, metaData, extraOptions),
        title: getTitle(layout, metaData, extraOptions.dashboard),
        subtitle: getSubtitle(layout, metaData, extraOptions.dashboard),
    }

    // TODO find a better name and way of accessing this extra object
    // also, is not necessarily present at all times
    // should we look at the indicatorType too?
    const indicatorInfo =
        metaData.items[metaData.dimensions.dx[0]].indicatorInfo

    // Use % symbol for factor 100 and the full string for others
    if (indicatorInfo?.factor !== INDICATOR_FACTOR_100) {
        config.subText = indicatorInfo?.displayName
    }

    return config
}
