import { getOuLevelAndGroupText } from '../../modules/getOuLevelAndGroupText.js'
import { dimensionGetItems } from '../../modules/layout/dimensionGetItems.js'
import { dimensionIs } from '../../modules/layout/dimensionIs.js'
import { ouIdHelper } from '../../modules/ouIdHelper/index.js'
import { DIMENSION_ID_ORGUNIT } from '../../modules/predefinedDimensions.js'

export default function (filters, metaData) {
    if (!Array.isArray(filters) || !filters.length) {
        return ''
    }

    const titleFragments = []
    let i
    let l

    filters.forEach((filter) => {
        const items = dimensionGetItems(filter)

        if (
            dimensionIs(filter, DIMENSION_ID_ORGUNIT) &&
            items.some(
                ({ id }) =>
                    ouIdHelper.hasGroupPrefix(id) ||
                    ouIdHelper.hasLevelPrefix(id)
            )
        ) {
            titleFragments.push(getOuLevelAndGroupText(filter, metaData))
        } else {
            const filterItems = metaData.dimensions[filter.dimension]

            if (Array.isArray(filterItems)) {
                l = filterItems.length
                let id
                const sectionParts = []

                for (i = 0; i < l; i++) {
                    id = filterItems[i]

                    // if the value is present in items take the name to show from there
                    if (metaData.items[id]) {
                        sectionParts.push(metaData.items[id].name)
                    }
                    // otherwise use the values directly
                    // this is a temporary fix to avoid app crashing when using filters with data items in EV
                    else {
                        sectionParts.push(
                            metaData.items[filter.dimension].name +
                                ': ' +
                                filterItems.join(', ')
                        )

                        break
                    }
                }

                titleFragments.push(sectionParts.join(', '))
            }
        }
    })

    return titleFragments.join(' - ')
}
