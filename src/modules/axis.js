import i18n from '@dhis2/d2-i18n'
import {
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
    AXIS_ID_VERTICAL,
    AXIS_ID_HORIZONTAL,
    //AXIS_ID_POINTS_CATEGORY,
} from './layout/axis'
import {
    LAYOUT_TYPE_DEFAULT,
    LAYOUT_TYPE_PIE,
    LAYOUT_TYPE_YEAR_OVER_YEAR,
    LAYOUT_TYPE_PIVOT_TABLE,
    LAYOUT_TYPE_SCATTER,
} from './layoutTypes'

const getAxisNamesByLayoutType = layoutType => {
    switch (layoutType) {
        case LAYOUT_TYPE_DEFAULT:
        case LAYOUT_TYPE_PIE:
        case LAYOUT_TYPE_YEAR_OVER_YEAR:
        default:
            return {
                [AXIS_ID_COLUMNS]: i18n.t('Series'),
                [AXIS_ID_ROWS]: i18n.t('Category'),
                [AXIS_ID_FILTERS]: i18n.t('Filter'),
            }
        case LAYOUT_TYPE_PIVOT_TABLE:
            return {
                [AXIS_ID_COLUMNS]: i18n.t('Columns'),
                [AXIS_ID_ROWS]: i18n.t('Rows'),
                [AXIS_ID_FILTERS]: i18n.t('Filter'),
            }
        case LAYOUT_TYPE_SCATTER:
            return {
                [AXIS_ID_VERTICAL]: i18n.t('Vertical'),
                [AXIS_ID_HORIZONTAL]: i18n.t('Horizontal'),
                [AXIS_ID_COLUMNS]: i18n.t('Points'),
                //[AXIS_ID_POINTS_CATEGORY]: i18n.t('Points category'),
                [AXIS_ID_FILTERS]: i18n.t('Filter'),
            }
    }
}

export const getAxisNameByLayoutType = (axisId, layoutType) => {
    const name = getAxisNamesByLayoutType(layoutType)[axisId]
    if (!name) {
        throw new Error(`${axisId} is not a valid axis id`)
    }

    return name
}

export const getAxisName = axisId =>
    getAxisNameByLayoutType(axisId, LAYOUT_TYPE_DEFAULT)

export const hasCustomAxes = series =>
    Boolean(series?.length && series.some(item => item.axis > 0))
