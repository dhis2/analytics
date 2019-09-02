import getFilterText from '../../../../util/getFilterText'

export default function(layout, metaData) {
    if (layout.columns) {
        const firstItem = layout.columns[0].items[0]

        const column = Object.assign({}, layout.columns[0], {
            items: [firstItem],
        })

        return getFilterText([column], metaData)
    }

    return ''
}
