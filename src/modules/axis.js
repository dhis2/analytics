import i18n from '@dhis2/d2-i18n'
import {
    AXIS_NAME_COLUMNS,
    AXIS_NAME_ROWS,
    AXIS_NAME_FILTERS,
    AXIS_NAME_YEAR_OVER_YEAR_SERIES,
    AXIS_NAME_YEAR_OVER_YEAR_CATEGORY,
} from './layout/axis'

export const axisDisplayNames = {
    [AXIS_NAME_COLUMNS]: i18n.t('Series'),
    [AXIS_NAME_ROWS]: i18n.t('Category'),
    [AXIS_NAME_FILTERS]: i18n.t('Filter'),
    [AXIS_NAME_YEAR_OVER_YEAR_SERIES]: i18n.t('Series'),
    [AXIS_NAME_YEAR_OVER_YEAR_CATEGORY]: i18n.t('Category'),
}

export const getAxisDisplayName = axisName => {
    const displayName = axisDisplayNames[axisName]

    if (!displayName) {
        throw new Error(`${axisName} is not a valid axis id`)
    }

    return displayName
}
