import i18n from '@dhis2/d2-i18n'

export const axisDisplayNames = {
    columns: i18n.t('Series'),
    rows: i18n.t('Category'),
    filters: i18n.t('Filter'),
    yearOverYearSeries: i18n.t('Series'),
    yearOverYearCategory: i18n.t('Category'),
}

export const getAxisDisplayName = axisName => {
    const displayName = axisDisplayNames[axisName]

    if (!displayName) {
        throw new Error(`${axisName} is not a valid axis id`)
    }

    return displayName
}
