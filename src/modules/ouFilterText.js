import i18n from '@dhis2/d2-i18n'
import { ouIdHelper } from './ouIdHelper'

export const getOuFilterText = (items, metaData, isLevel) => {
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
