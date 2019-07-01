import isArray from 'd2-utilizr/lib/isArray'
import i18n from '@dhis2/d2-i18n'
import { ouIdHelper } from '../../../../modules/ouIdHelper'
import { dimensionIs } from '../../../../modules/layout/dimensionIs'
import { DIMENSION_ID_ORGUNIT } from '../../../../modules/fixedDimensions'
import { dimensionGetItems } from '../../../../modules/layout/dimensionGetItems'

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
                    titleParts.push(getOuTitle(items, metaData, false))
                }

                if (hasOuLevel) {
                    titleParts.push(getOuTitle(items, metaData, true))
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

const getOuTitle = (items, metaData, isLevel) => {
    const getNameFromMetadata = id =>
        metaData.items[id] ? metaData.items[id].name : id

    const dynamicOuItems = items.filter(item =>
        isLevel
            ? ouIdHelper.hasLevelPrefix(item.id)
            : ouIdHelper.hasGroupPrefix(item.id)
    )
    const lastItem = dynamicOuItems.length > 1 ? dynamicOuItems.pop() : null
    const dynamicOuNames = dynamicOuItems
        .map(item => getNameFromMetadata(ouIdHelper.removePrefix(item.id)))
        .join(', ')

    let allDynamicOuNames

    if (lastItem) {
        const lastOuName = getNameFromMetadata(
            ouIdHelper.removePrefix(lastItem.id)
        )
        allDynamicOuNames = `${dynamicOuNames} ${i18n.t('and')} ${lastOuName}`
    } else {
        allDynamicOuNames = dynamicOuNames
    }

    const staticOuNames = items
        .filter(
            item =>
                !ouIdHelper.hasGroupPrefix(item.id) &&
                !ouIdHelper.hasLevelPrefix(item.id)
        )
        .map(item => getNameFromMetadata(item.id))
        .join(', ')

    const joiner = isLevel ? i18n.t('levels in') : i18n.t('groups in')

    return `${allDynamicOuNames} ${joiner} ${staticOuNames}`
}
