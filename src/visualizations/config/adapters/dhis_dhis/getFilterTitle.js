import isArray from 'd2-utilizr/lib/isArray'

export default function(filters, metaData) {
    if (isArray(filters) && filters.length) {
        const titleFragments = []

        filters.forEach(filter => {
            const filterItems = filter.items || []
            const sectionParts = filterItems.map(item => {
                const id = item.id
                return metaData.items[id] ? metaData.items[id].name : id
            })

            titleFragments.push(sectionParts.join(', '))
        })

        return titleFragments.join(' - ')
    }

    return null
}
