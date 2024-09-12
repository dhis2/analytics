import getFilterText from '../../../../util/getFilterText.js'
export { getSingleValueTextColor as getSingleValueSubtitleColor } from '../customSVGOptions/singleValue/index.js'

export default function getSingleValueSubtitle(layout, metaData) {
    if (layout.hideSubtitle) {
        return ''
    }

    if (typeof layout.subtitle === 'string' && layout.subtitle.length) {
        return layout.subtitle
    }

    if (layout.filters) {
        return getFilterText(layout.filters, metaData)
    }

    return ''
}
