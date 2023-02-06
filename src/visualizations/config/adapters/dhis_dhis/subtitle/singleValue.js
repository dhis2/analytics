import getFilterText from '../../../../util/getFilterText.js'

export default function (layout, metaData) {
    return layout.filters ? getFilterText(layout.filters, metaData) : ''
}
