import getFilterText from '../getFilterText'

export default function(layout, metaData) {
    return layout.filters ? getFilterText(layout.filters, metaData) : ''
}
