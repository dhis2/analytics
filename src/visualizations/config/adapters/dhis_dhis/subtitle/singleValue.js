import getFilterText from '../../../../util/getFilterText'

export default function(layout, metaData) {
    return layout.filters ? getFilterText(layout.filters, metaData) : ''
}
