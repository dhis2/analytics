export default function(filters, metaData) {
    if (Array.isArray(filters) && filters.length) {
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
