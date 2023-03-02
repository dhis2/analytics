import getSubtitle from './subtitle/index.js'
import getTitle from './title/index.js'
import getValue from './value/index.js'

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
        value: data[0],
        formattedValue:
            data[0] === undefined
                ? extraOptions.noData.text
                : getValue(data[0], layout, metaData),
        title: getTitle(layout, metaData, extraOptions.dashboard),
        subtitle: getSubtitle(layout, metaData, extraOptions.dashboard),
    }

    const indicatorType =
        metaData.items[metaData.dimensions.dx[0]].indicatorType

    // Use % symbol for factor 100 and the full string for others
    if (indicatorType?.factor !== INDICATOR_FACTOR_100) {
        config.subText = indicatorType?.displayName
    }

    // DHIS2-10496: show icon on the side of the value if an icon is assigned in Maintenance app and the option is set in DV options
    const showIcon = Boolean(layout.icons?.length)
    const icon = metaData.items[metaData.dimensions.dx[0]].style?.icon

    if (showIcon && icon) {
        config.icon = icon
    }

    return config
}
