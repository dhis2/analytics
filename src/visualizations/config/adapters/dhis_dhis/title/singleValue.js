import getFilterTitle from '../getFilterTitle'

export default function(layout, metaData) {
    if (layout.columns) {
        const items = [layout.columns[0].items[0]]
        const single = Object.assign({}, layout.columns[0], { items })

        return getFilterTitle([single], metaData)
    }

    return null
}
