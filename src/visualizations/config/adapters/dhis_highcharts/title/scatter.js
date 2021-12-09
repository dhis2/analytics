import getFilterText from '../../../../util/getFilterText.js'

export default function (layout, metaData, dashboard) {
    if (layout.rows?.length && layout.columns?.length && !dashboard) {
        const columns = getFilterText(layout.columns, metaData).split(', ')
        return `${getFilterText(layout.rows, metaData)}: ${columns[0]} - ${
            columns[1]
        }`
    }
}
