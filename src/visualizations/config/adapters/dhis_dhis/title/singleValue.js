import getFilterTitle from '../getFilterTitle'

export default function(layout, metaData, dashboard) {
    const titleFragments = []

    if (layout.columns && !dashboard) {
        titleFragments.push(getFilterTitle(layout.columns, metaData))
    }

    if (layout.filters && !dashboard) {
        titleFragments.push(getFilterTitle(layout.filters, metaData))
    }

    return titleFragments.length ? titleFragments.join(' - ') : null
}
