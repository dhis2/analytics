import i18n from '@dhis2/d2-i18n'
import BarIcon from '../assets/BarIcon'
import StackedBarIcon from '../assets/StackedBarIcon'
import ColumnIcon from '../assets/ColumnIcon'
import StackedColumnIcon from '../assets/StackedColumnIcon'
import LineIcon from '../assets/LineIcon'
import AreaIcon from '../assets/AreaIcon'
import StackedAreaIcon from '../assets/StackedAreaIcon'
import PieIcon from '../assets/PieIcon'
import RadarIcon from '../assets/RadarIcon'
import GaugeIcon from '../assets/GaugeIcon'
import YearOverYearLineIcon from '../assets/YearOverYearLineIcon'
import YearOverYearColumnIcon from '../assets/YearOverYearColumnIcon'
import SingleValueIcon from '../assets/SingleValueIcon'
import PivotTableIcon from '../assets/PivotTableIcon'

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
}

export const visTypeDescriptions = {
    [VIS_TYPE_PIVOT_TABLE]: i18n.t(
        'View data and indicators in a manipulatable table.'
    ),
    [VIS_TYPE_COLUMN]: i18n.t(
        'Compare sizes of related element, displayed vertically. Recommend period in filter.'
    ),
    [VIS_TYPE_STACKED_COLUMN]: i18n.t(
        'Compare parts of a whole against related elements, vertically. Recommend data or org. unit as series.'
    ),
    [VIS_TYPE_BAR]: i18n.t(
        'Compare sizes of related elements, displayed horizontally. Recommend period in filter.'
    ),
    [VIS_TYPE_STACKED_BAR]: i18n.t(
        'Compare parts of a whole against related elements, horizontally. Recommend data or org. unit as series.'
    ),
    [VIS_TYPE_LINE]: i18n.t(
        'Track or compare changes over time. Recommend period as the category.'
    ),
    [VIS_TYPE_AREA]: i18n.t(
        'Track or compare changes over time. Recommend period as the category.'
    ),
    [VIS_TYPE_STACKED_AREA]: i18n.t(
        'Track or compare over time parts of a whole. Recommend data in series and period in category.'
    ),
    [VIS_TYPE_PIE]: i18n.t(
        'Compare parts of a whole at a single point in time. Recommend period in the filter.'
    ),
    [VIS_TYPE_RADAR]: i18n.t(
        'Compare several items against multiple variables.'
    ),
    [VIS_TYPE_GAUGE]: i18n.t(
        'Compare a percentage indicator against a 100% scale. Recommend period in filter.'
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
}

export const visTypeIcons = {
    [VIS_TYPE_PIVOT_TABLE]: PivotTableIcon,
    [VIS_TYPE_BAR]: BarIcon,
    [VIS_TYPE_STACKED_BAR]: StackedBarIcon,
    [VIS_TYPE_COLUMN]: ColumnIcon,
    [VIS_TYPE_STACKED_COLUMN]: StackedColumnIcon,
    [VIS_TYPE_LINE]: LineIcon,
    [VIS_TYPE_AREA]: AreaIcon,
    [VIS_TYPE_STACKED_AREA]: StackedAreaIcon,
    [VIS_TYPE_PIE]: PieIcon,
    [VIS_TYPE_RADAR]: RadarIcon,
    [VIS_TYPE_GAUGE]: GaugeIcon,
    [VIS_TYPE_YEAR_OVER_YEAR_LINE]: YearOverYearLineIcon,
    [VIS_TYPE_YEAR_OVER_YEAR_COLUMN]: YearOverYearColumnIcon,
    [VIS_TYPE_SINGLE_VALUE]: SingleValueIcon,
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

const dualAxisTypes = [VIS_TYPE_COLUMN, VIS_TYPE_BAR, VIS_TYPE_LINE]

const dualCategoryChartTypes = [VIS_TYPE_COLUMN, VIS_TYPE_STACKED_COLUMN]

export const defaultVisType = VIS_TYPE_COLUMN
export const isStacked = type => stackedTypes.includes(type)
export const isYearOverYear = type => yearOverYearTypes.includes(type)
export const isDualAxisType = type => dualAxisTypes.includes(type)
export const isSingleValue = type => type === VIS_TYPE_SINGLE_VALUE
export const isDualCategoryChartType = type =>
    dualCategoryChartTypes.includes(type)
