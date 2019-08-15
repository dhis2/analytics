import isArray from 'd2-utilizr/lib/isArray'
import { ouIdHelper } from '../../../../modules/ouIdHelper'
import { dimensionIs } from '../../../../modules/layout/dimensionIs'
import { DIMENSION_ID_ORGUNIT } from '../../../../modules/fixedDimensions'
import { dimensionGetItems } from '../../../../modules/layout/dimensionGetItems'
import { getOuFilterText } from '../../../../modules/ouFilterText'

export default function(filters, metaData) {
    if (isArray(filters)) {
        const titleParts = []
        let i
        let l

        filters.forEach(filter => {
            const items = dimensionGetItems(filter)
            const hasOuLevel =
                dimensionIs(filter, DIMENSION_ID_ORGUNIT) &&
                items.some(item => ouIdHelper.hasLevelPrefix(item.id))
            const hasOuGroup =
                dimensionIs(filter, DIMENSION_ID_ORGUNIT) &&
                items.some(item => ouIdHelper.hasGroupPrefix(item.id))

            if (hasOuLevel || hasOuGroup) {
                if (hasOuGroup) {
                    titleParts.push(getOuFilterText(items, metaData, false))
                }

                if (hasOuLevel) {
                    titleParts.push(getOuFilterText(items, metaData, true))
                }
            } else {
                const filterItems = metaData.dimensions[filter.dimension]

                if (isArray(filterItems)) {
                    l = filterItems.length
                    let id
                    let sectionParts = []

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

                    titleParts.push(sectionParts.join(', '))
                }
            }
        })

        return titleParts.join(' - ')
    }

    return null
}
