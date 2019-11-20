import i18n from '@dhis2/d2-i18n'
import {
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
    AXIS_ID_YEAR_OVER_YEAR_SERIES,
    AXIS_ID_YEAR_OVER_YEAR_CATEGORY,
} from './layout/axis'

export const axisNames = {
    [AXIS_ID_COLUMNS]: i18n.t('Series'),
    [AXIS_ID_ROWS]: i18n.t('Category'),
    [AXIS_ID_FILTERS]: i18n.t('Filter'),
    [AXIS_ID_YEAR_OVER_YEAR_SERIES]: i18n.t('Series'),
    [AXIS_ID_YEAR_OVER_YEAR_CATEGORY]: i18n.t('Category'),
}

export const getAxisName = axisId => {
    const displayName = axisNames[axisId]

    if (!displayName) {
        throw new Error(`${axisId} is not a valid axis id`)
    }

    return displayName
}
