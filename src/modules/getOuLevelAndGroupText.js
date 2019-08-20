import i18n from '@dhis2/d2-i18n'
import { ouIdHelper } from './ouIdHelper'
import { dimensionIs } from './layout/dimensionIs'
import { dimensionGetItems } from './layout/dimensionGetItems'
import { DIMENSION_ID_ORGUNIT } from './fixedDimensions'

export const getOuLevelAndGroupText = (filter, metaData) => {
    if (!dimensionIs(DIMENSION_ID_ORGUNIT)) {
        return ''
    }

    const items = dimensionGetItems(filter)
    const hasOuLevel = items.some(item => ouIdHelper.hasLevelPrefix(item.id))
    const hasOuGroup = items.some(item => ouIdHelper.hasGroupPrefix(item.id))

    const filterFragments = []

    if (hasOuGroup) {
        filterFragments.push(getLevelAndGroupText(items, metaData, false))
    }

    if (hasOuLevel) {
        filterFragments.push(getLevelAndGroupText(items, metaData, true))
    }

    return filterFragments.join(' - ')
}

const getLevelAndGroupText = (items, metaData, isLevel) => {
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
