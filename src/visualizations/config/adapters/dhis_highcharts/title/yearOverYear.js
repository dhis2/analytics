import getFilterText from '../../../../../util/getFilterText'

export default function(layout, metaData, dashboard) {
    const titleFragments = []

    if (layout.columns && !dashboard) {
        titleFragments.push(getFilterText(layout.columns, metaData))
    }

    if (layout.filters && !dashboard) {
        titleFragments.push(getFilterText(layout.filters, metaData))
    }

    return titleFragments.length ? titleFragments.join(' - ') : null
}
