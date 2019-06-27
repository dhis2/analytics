import isArray from 'd2-utilizr/lib/isArray'
import { ouIdHelper } from '../../../../modules/ouIdHelper'
import i18n from '@dhis2/d2-i18n'

export default function(filters, metaData) {
    if (isArray(filters)) {
        const titleParts = []

        filters.forEach(filter => {
            const hasOuLevel =
                filter.dimension === 'ou'
                    ? filter.items.some(item =>
                          ouIdHelper.hasLevelPrefix(item.id)
                      )
                    : false
            const hasOuGroup =
                filter.dimension === 'ou'
                    ? filter.items.some(item =>
                          ouIdHelper.hasGroupPrefix(item.id)
                      )
                    : false

            if (hasOuLevel || hasOuGroup) {
                if (hasOuGroup) {
                    titleParts.push(
                        getOuFilterTitle(filter.items, metaData, false)
                    )
                }

                if (hasOuLevel) {
                    titleParts.push(
                        getOuFilterTitle(filter.items, metaData, true)
                    )
                }
            } else {
                const filterItems = metaData.dimensions[filter.dimension]

                if (isArray(filterItems)) {
                    const hasMetadata = filterItems.some(id =>
                        Boolean(metaData.items[id])
                    )

                    if (hasMetadata) {
                        const sectionParts = filterItems.map(
                            id => metaData.items[id].name
                        )

                        titleParts.push(sectionParts.join(', '))
                    } else {
                        // use the values directly. This is a temporary fix to prevent
                        // the EV app from crashing when using filters with data items
                        titleParts.push(
                            metaData.items[filter.dimension].name +
                                ': ' +
                                filterItems.join(', ')
                        )
                    }
                }
            }
        })

        return titleParts.join(' - ')
    }

    return null
}

const getOuFilterTitle = (items, metaData, isLevel) => {
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
