import i18n from '@dhis2/d2-i18n'

export default function(acc, seriesIds, categoryIds, idValueMap, metaData) {
    const seriesId = seriesIds[0]

    acc.push(idValueMap.get(seriesId) || i18n.t('No data'))
}
