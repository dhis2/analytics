import i18n from '@dhis2/d2-i18n'
import { DIMENSION_ID_DATA } from './fixedDimensions'
import { AXIS_ID_COLUMNS } from './layout/axis'

export const VIS_TYPE_COLUMN = 'COLUMN'
export const VIS_TYPE_STACKED_COLUMN = 'STACKED_COLUMN'
export const VIS_TYPE_BAR = 'BAR'
export const VIS_TYPE_STACKED_BAR = 'STACKED_BAR'
export const VIS_TYPE_LINE = 'LINE'
export const VIS_TYPE_AREA = 'AREA'
export const VIS_TYPE_PIE = 'PIE'
export const VIS_TYPE_RADAR = 'RADAR'
export const VIS_TYPE_GAUGE = 'GAUGE'
export const VIS_TYPE_BUBBLE = 'BUBBLE'
export const VIS_TYPE_YEAR_OVER_YEAR_LINE = 'YEAR_OVER_YEAR_LINE'
export const VIS_TYPE_YEAR_OVER_YEAR_COLUMN = 'YEAR_OVER_YEAR_COLUMN'
export const VIS_TYPE_SINGLE_VALUE = 'SINGLE_VALUE'

export const visTypeDisplayNames = {
    [VIS_TYPE_COLUMN]: i18n.t('Column'),
    [VIS_TYPE_STACKED_COLUMN]: i18n.t('Stacked column'),
    [VIS_TYPE_BAR]: i18n.t('Bar'),
    [VIS_TYPE_STACKED_BAR]: i18n.t('Stacked bar'),
    [VIS_TYPE_LINE]: i18n.t('Line'),
    [VIS_TYPE_AREA]: i18n.t('Area'),
    [VIS_TYPE_PIE]: i18n.t('Pie'),
    [VIS_TYPE_RADAR]: i18n.t('Radar'),
    [VIS_TYPE_GAUGE]: i18n.t('Gauge'),
    [VIS_TYPE_YEAR_OVER_YEAR_LINE]: i18n.t('Year over year (line)'),
    [VIS_TYPE_YEAR_OVER_YEAR_COLUMN]: i18n.t('Year over year (column)'),
    [VIS_TYPE_SINGLE_VALUE]: i18n.t('Single value'),
}

export const getDisplayNameByVisType = visType => {
    const displayName = visTypeDisplayNames[visType]

    if (!displayName) {
        throw new Error(`${visType} is not a valid visualization type`)
    }

    return displayName
}

const stackedTypes = [
    VIS_TYPE_STACKED_COLUMN,
    VIS_TYPE_STACKED_BAR,
    VIS_TYPE_AREA,
]

const yearOverYearTypes = [
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
]

const dualAxisTypes = [
    VIS_TYPE_COLUMN,
    VIS_TYPE_BAR,
    VIS_TYPE_LINE,
    VIS_TYPE_AREA,
]

export const defaultVisType = VIS_TYPE_COLUMN
export const isStacked = type => stackedTypes.includes(type)
export const isYearOverYear = type => yearOverYearTypes.includes(type)
export const isDualAxisType = type => dualAxisTypes.includes(type)
export const isSingleValue = type => type === VIS_TYPE_SINGLE_VALUE
