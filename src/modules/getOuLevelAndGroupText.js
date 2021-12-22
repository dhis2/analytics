import i18n from '../locales/index.js'
import { dimensionGetItems } from './layout/dimensionGetItems.js'
import { dimensionIs } from './layout/dimensionIs.js'
import { ouIdHelper } from './ouIdHelper/index.js'
import { DIMENSION_ID_ORGUNIT } from './predefinedDimensions.js'

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
        allDynamicOuNames = i18n.t('{{dynamicOuNames}} and {{lastOuName}}', {
            dynamicOuNames,
            lastOuName,
        })
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

    let ouLevelAndGroupText = ''
    if (!staticOuNames) {
        if (isLevel) {
            ouLevelAndGroupText = i18n.t('{{allDynamicOuNames}} levels', {
                allDynamicOuNames,
            })
        } else {
            ouLevelAndGroupText = i18n.t('{{allDynamicOuNames}} groups', {
                allDynamicOuNames,
            })
        }
    } else {
        if (isLevel) {
            ouLevelAndGroupText = i18n.t(
                '{{allDynamicOuNames}} levels in {{staticOuNames}}',
                {
                    allDynamicOuNames,
                    staticOuNames,
                }
            )
        } else {
            ouLevelAndGroupText = i18n.t(
                '{{allDynamicOuNames}} groups in {{staticOuNames}}',
                {
                    allDynamicOuNames,
                    staticOuNames,
                }
            )
        }
    }

    return ouLevelAndGroupText
}
