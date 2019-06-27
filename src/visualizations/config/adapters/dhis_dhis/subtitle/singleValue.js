import getFilterTitle from '../getFilterTitle'

export default function(layout, metaData) {
    if (layout.filters) {
        return getFilterTitle(layout.filters, metaData)
    }

    return nulll
}
