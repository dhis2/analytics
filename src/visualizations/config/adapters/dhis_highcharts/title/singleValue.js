import getFilterText from '../../../../util/getFilterText.js'
export { getSingleValueTitleColor } from '../customSVGOptions/singleValue/getSingleValueTitleColor.js'

export function getSingleValueTitleText(layout, metaData) {
    if (layout.hideTitle) {
        return ''
    }

    if (typeof layout.title === 'string' && layout.title.length) {
        return layout.title
    }

    if (layout.columns) {
        const firstItem = layout.columns[0].items[0]

        const column = Object.assign({}, layout.columns[0], {
            items: [firstItem],
        })

        return getFilterText([column], metaData)
    }
    return ''
}
