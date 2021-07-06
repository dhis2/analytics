import {
    IconTable24,
    IconVisualizationArea24,
    IconVisualizationAreaStacked24,
    IconVisualizationBar24,
    IconVisualizationBarStacked24,
    IconVisualizationColumn24,
    IconVisualizationColumnMulti24,
    IconVisualizationColumnStacked24,
    IconVisualizationGauge24,
    IconVisualizationLine24,
    IconVisualizationLineMulti24,
    IconVisualizationPie24,
    IconVisualizationRadar24,
    IconVisualizationScatter24,
    IconVisualizationSingleValue24,
} from '@dhis2/ui'
import i18n from '../locales/index.js'
export const VIS_TYPE_COLUMN = 'COLUMN'
export const VIS_TYPE_STACKED_COLUMN = 'STACKED_COLUMN'
export const VIS_TYPE_BAR = 'BAR'
export const VIS_TYPE_STACKED_BAR = 'STACKED_BAR'
export const VIS_TYPE_LINE = 'LINE'
export const VIS_TYPE_AREA = 'AREA'
export const VIS_TYPE_STACKED_AREA = 'STACKED_AREA'
export const VIS_TYPE_PIE = 'PIE'
export const VIS_TYPE_RADAR = 'RADAR'
export const VIS_TYPE_GAUGE = 'GAUGE'
export const VIS_TYPE_BUBBLE = 'BUBBLE'
export const VIS_TYPE_YEAR_OVER_YEAR_LINE = 'YEAR_OVER_YEAR_LINE'
export const VIS_TYPE_YEAR_OVER_YEAR_COLUMN = 'YEAR_OVER_YEAR_COLUMN'
export const VIS_TYPE_SINGLE_VALUE = 'SINGLE_VALUE'
export const VIS_TYPE_PIVOT_TABLE = 'PIVOT_TABLE'
export const VIS_TYPE_SCATTER = 'SCATTER'

export const visTypeDisplayNames = {
    [VIS_TYPE_PIVOT_TABLE]: i18n.t('Pivot table'),
    [VIS_TYPE_COLUMN]: i18n.t('Column'),
    [VIS_TYPE_STACKED_COLUMN]: i18n.t('Stacked column'),
    [VIS_TYPE_BAR]: i18n.t('Bar'),
    [VIS_TYPE_STACKED_BAR]: i18n.t('Stacked bar'),
    [VIS_TYPE_LINE]: i18n.t('Line'),
    [VIS_TYPE_AREA]: i18n.t('Area'),
    [VIS_TYPE_STACKED_AREA]: i18n.t('Stacked area'),
    [VIS_TYPE_PIE]: i18n.t('Pie'),
    [VIS_TYPE_RADAR]: i18n.t('Radar'),
    [VIS_TYPE_GAUGE]: i18n.t('Gauge'),
    [VIS_TYPE_YEAR_OVER_YEAR_LINE]: i18n.t('Year over year (line)'),
    [VIS_TYPE_YEAR_OVER_YEAR_COLUMN]: i18n.t('Year over year (column)'),
    [VIS_TYPE_SINGLE_VALUE]: i18n.t('Single value'),
    [VIS_TYPE_SCATTER]: i18n.t('Scatter'),
}

export const visTypeDescriptions = {
    [VIS_TYPE_PIVOT_TABLE]: i18n.t(
        'View data and indicators in a manipulatable table.'
    ),
    [VIS_TYPE_COLUMN]: i18n.t(
        'Compare sizes of related elements vertically. Recommend period as filter.'
    ),
    [VIS_TYPE_STACKED_COLUMN]: i18n.t(
        'Compare parts of a whole against related elements vertically. Recommend data or org. unit as series.'
    ),
    [VIS_TYPE_BAR]: i18n.t(
        'Compare sizes of related elements horizontally. Recommend period as filter.'
    ),
    [VIS_TYPE_STACKED_BAR]: i18n.t(
        'Compare parts of a whole against related elements horizontally. Recommend data or org. unit as series.'
    ),
    [VIS_TYPE_LINE]: i18n.t(
        'Track or compare changes over time. Recommend period as category.'
    ),
    [VIS_TYPE_AREA]: i18n.t(
        'Track or compare changes over time. Recommend period as category.'
    ),
    [VIS_TYPE_STACKED_AREA]: i18n.t(
        'Track or compare parts of a whole over time. Recommend data as series and period as category.'
    ),
    [VIS_TYPE_PIE]: i18n.t(
        'Compare parts of a whole at a single point in time. Recommend period as filter.'
    ),
    [VIS_TYPE_RADAR]: i18n.t(
        'Compare several items against multiple variables.'
    ),
    [VIS_TYPE_GAUGE]: i18n.t(
        'Compare a percentage indicator against a 100% scale. Recommend period as filter.'
    ),
    [VIS_TYPE_YEAR_OVER_YEAR_LINE]: i18n.t(
        'Compare changes over time between multiple time periods.'
    ),
    [VIS_TYPE_YEAR_OVER_YEAR_COLUMN]: i18n.t(
        'Compare changes over time between multiple time periods.'
    ),
    [VIS_TYPE_SINGLE_VALUE]: i18n.t(
        'Display a single value. Recommend relative period to show latest data.'
    ),
    [VIS_TYPE_SCATTER]: i18n.t(
        'View the relationship between two data items at a place or time. Recommended for finding outliers.'
    ),
}

export const visTypeIcons = {
    [VIS_TYPE_PIVOT_TABLE]: IconTable24,
    [VIS_TYPE_BAR]: IconVisualizationBar24,
    [VIS_TYPE_STACKED_BAR]: IconVisualizationBarStacked24,
    [VIS_TYPE_COLUMN]: IconVisualizationColumn24,
    [VIS_TYPE_STACKED_COLUMN]: IconVisualizationColumnStacked24,
    [VIS_TYPE_LINE]: IconVisualizationLine24,
    [VIS_TYPE_AREA]: IconVisualizationArea24,
    [VIS_TYPE_STACKED_AREA]: IconVisualizationAreaStacked24,
    [VIS_TYPE_PIE]: IconVisualizationPie24,
    [VIS_TYPE_RADAR]: IconVisualizationRadar24,
    [VIS_TYPE_GAUGE]: IconVisualizationGauge24,
    [VIS_TYPE_YEAR_OVER_YEAR_LINE]: IconVisualizationLineMulti24,
    [VIS_TYPE_YEAR_OVER_YEAR_COLUMN]: IconVisualizationColumnMulti24,
    [VIS_TYPE_SINGLE_VALUE]: IconVisualizationSingleValue24,
    [VIS_TYPE_SCATTER]: IconVisualizationScatter24,
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
    VIS_TYPE_STACKED_AREA,
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

const multiTypeTypes = [VIS_TYPE_COLUMN, VIS_TYPE_LINE]

const twoCategoryChartTypes = [
    VIS_TYPE_COLUMN,
    VIS_TYPE_STACKED_COLUMN,
    VIS_TYPE_BAR,
    VIS_TYPE_STACKED_BAR,
    VIS_TYPE_LINE,
    VIS_TYPE_AREA,
    VIS_TYPE_STACKED_AREA,
]

const columnBasedTypes = [
    VIS_TYPE_COLUMN,
    VIS_TYPE_BAR,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_STACKED_COLUMN,
    VIS_TYPE_STACKED_BAR,
]

const verticalTypes = [VIS_TYPE_BAR, VIS_TYPE_STACKED_BAR, VIS_TYPE_GAUGE]

const legendSetTypes = [
    VIS_TYPE_COLUMN,
    VIS_TYPE_BAR,
    VIS_TYPE_GAUGE,
    VIS_TYPE_SINGLE_VALUE,
    VIS_TYPE_PIVOT_TABLE,
]

export const defaultVisType = VIS_TYPE_COLUMN
export const isStacked = type => stackedTypes.includes(type)
export const isYearOverYear = type => yearOverYearTypes.includes(type)
export const isDualAxisType = type => dualAxisTypes.includes(type)
export const isMultiType = type => multiTypeTypes.includes(type)
export const isSingleValue = type => type === VIS_TYPE_SINGLE_VALUE
export const isTwoCategoryChartType = type =>
    twoCategoryChartTypes.includes(type)
export const isVerticalType = type => verticalTypes.includes(type)
export const isLegendSetType = type => legendSetTypes.includes(type)
export const isColumnBasedType = type => columnBasedTypes.includes(type)
