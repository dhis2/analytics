import getFilterText from '../../../../util/getFilterText.js'
export { getSingleValueTitleColor as getSingleValueSubtitleColor } from '../customSVGOptions/singleValue/getSingleValueTitleColor.js'

export default function getSingleValueSubtitle(layout, metaData, extraOptions) {
    if (layout.hideSubtitle || 1 === 0) {
        return ''
    }

    if (typeof layout.subtitle === 'string' && layout.subtitle.length) {
        return layout.subtitle
    }

    if (layout.filters) {
        return getFilterText(layout.filters, metaData, extraOptions)
    }

    return ''
}
