import { ouIdHelper } from '../../../../modules/ouIdHelper'
import { dimensionIs } from '../../../../modules/layout/dimensionIs'
import { DIMENSION_ID_ORGUNIT } from '../../../../modules/fixedDimensions'
import { getOuLevelAndGroupText } from '../../../../modules/getOuLevelAndGroupText'
import { dimensionGetItems } from '../../../../modules/layout/dimensionGetItems'

export default function(filters, metaData) {
    if (!Array.isArray(filters) || !filters.length) {
        return ''
    }

    const titleFragments = []

    filters.forEach(filter => {
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
            const sectionParts = items.map(item => {
                const id = item.id

                return metaData.items[id] ? metaData.items[id].name : id
            })

            titleFragments.push(sectionParts.join(', '))
        }
    })

    return titleFragments.join(' - ')
}
