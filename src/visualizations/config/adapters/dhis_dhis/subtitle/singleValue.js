import getFilterTitle from '../getFilterTitle'

export default function(layout, metaData) {
    return layout.filters ? getFilterTitle(layout.filters, metaData) : null
}
