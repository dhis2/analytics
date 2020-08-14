import './locales'
// Components

export { default as DataDimension } from './components/DataDimension/DataDimension'

export { default as PeriodDimension } from './components/PeriodDimension/PeriodDimension'
export { default as FixedPeriodSelect } from './components/PeriodDimension/FixedPeriodSelect'

export { default as OrgUnitDimension } from './components/OrgUnitDimension/OrgUnitDimension'

export { default as DynamicDimension } from './components/DynamicDimension/DynamicDimension'

export { default as DimensionsPanel } from './components/DimensionsPanel/DimensionsPanel'
export { default as DimensionItem } from './components/DimensionsPanel/List/DimensionItem'
export { default as DimensionFilter } from './components/Filter/Filter'

export { default as ItemSelector } from './components/ItemSelector/ItemSelector'

export { default as DimensionMenu } from './components/DimensionMenu'

export { default as PivotTable } from './components/PivotTable/PivotTable'

// Api

export { apiFetchDimensions, apiFetchRecommendedIds } from './api/dimensions'

// Modules: axis

export {
    getAxisName,
    getAxisNameByLayoutType,
    hasCustomAxes,
} from './modules/axis'

// Modules: predefined dimensions

export {
    DIMENSION_ID_DATA,
    DIMENSION_ID_PERIOD,
    DIMENSION_ID_ORGUNIT,
    DIMENSION_ID_ASSIGNED_CATEGORIES,
    DIMENSION_PROP_NO_ITEMS,
    filterOutPredefinedDimensions,
    getPredefinedDimensionProp,
    getDimensionById,
    getPredefinedDimensions,
    getFixedDimensions,
    getDynamicDimensions,
} from './modules/predefinedDimensions'

// Modules: ouIdHelper

export { ouIdHelper } from './modules/ouIdHelper'

// Modules: layout

export { LAYOUT } from './modules/layout/layout'
export { layoutFilterDimensions } from './modules/layout/layoutFilterDimensions'
export { layoutGetAllAxes } from './modules/layout/layoutGetAllAxes'
export { layoutGetAllDimensions } from './modules/layout/layoutGetAllDimensions'
export { layoutGetAllItemIds } from './modules/layout/layoutGetAllItemIds'
export { layoutGetAllItems } from './modules/layout/layoutGetAllItems'
export { layoutGetAxisIdDimensionIdsObject } from './modules/layout/layoutGetAxisIdDimensionIdsObject'
export { layoutGetDimension } from './modules/layout/layoutGetDimension'
export { layoutGetDimensionItems } from './modules/layout/layoutGetDimensionItems'
export { layoutReplaceDimension } from './modules/layout/layoutReplaceDimension'
export { layoutGetDimensionIdItemIdsObject } from './modules/layout/layoutGetDimensionIdItemIdsObject'
export { layoutHasDataDimension } from './modules/layout/layoutHasDataDimension'
export { layoutHasDimension } from './modules/layout/layoutHasDimension'
export { layoutHasDynamicDimension } from './modules/layout/layoutHasDynamicDimension'
export { layoutHasPeriodDimension } from './modules/layout/layoutHasPeriodDimension'

export {
    AXIS,
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
    DEFAULT_AXIS_IDS,
} from './modules/layout/axis'
export { axisGetAllItems } from './modules/layout/axisGetAllItems'
export { axisGetDimension } from './modules/layout/axisGetDimension'
export { axisGetDimensionIds } from './modules/layout/axisGetDimensionIds'
export { axisHasDataDimension } from './modules/layout/axisHasDataDimension'
export { axisHasDimension } from './modules/layout/axisHasDimension'
export { axisHasPeriodDimension } from './modules/layout/axisHasPeriodDimension'
export { axisHasOuDimension } from './modules/layout/axisHasOuDimension'
export { axisIsEmpty } from './modules/layout/axisIsEmpty'

export {
    DIMENSION,
    DIMENSION_PROP_ID,
    DIMENSION_PROP_ITEMS,
    DIMENSION_PROPS,
} from './modules/layout/dimension'
export { dimensionCreate } from './modules/layout/dimensionCreate'
export { dimensionGetId } from './modules/layout/dimensionGetId'
export { dimensionGetItemIds } from './modules/layout/dimensionGetItemIds'
export { dimensionGetItems } from './modules/layout/dimensionGetItems'
export { dimensionIs } from './modules/layout/dimensionIs'
export { dimensionIsEmpty } from './modules/layout/dimensionIsEmpty'
export { dimensionIsValid } from './modules/layout/dimensionIsValid'

export { ITEM, ITEM_PROP_ID, ITEM_PROPS } from './modules/layout/item'
export { itemGetId } from './modules/layout/itemGetId'
export { itemIsValid } from './modules/layout/itemIsValid'

// Modules: visTypeToLayoutType

export { getLayoutTypeByVisType } from './modules/visTypeToLayoutType'

// Modules: visTypes

export {
    VIS_TYPE_COLUMN,
    VIS_TYPE_STACKED_COLUMN,
    VIS_TYPE_BAR,
    VIS_TYPE_STACKED_BAR,
    VIS_TYPE_LINE,
    VIS_TYPE_AREA,
    VIS_TYPE_STACKED_AREA,
    VIS_TYPE_PIE,
    VIS_TYPE_RADAR,
    VIS_TYPE_GAUGE,
    VIS_TYPE_BUBBLE,
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_SINGLE_VALUE,
    VIS_TYPE_PIVOT_TABLE,
    visTypeDisplayNames,
    visTypeDescriptions,
    visTypeIcons,
    getDisplayNameByVisType,
    defaultVisType,
    isStacked,
    isYearOverYear,
    isDualAxisType,
    isSingleValue,
    isTwoCategoryChartType,
} from './modules/visTypes'

// Modules: layoutTypes

export {
    LAYOUT_TYPE_DEFAULT,
    LAYOUT_TYPE_PIE,
    LAYOUT_TYPE_SINGLE_VALUE,
    LAYOUT_TYPE_YEAR_OVER_YEAR,
    LAYOUT_TYPE_PIVOT_TABLE,
} from './modules/layoutTypes'

// Modules: layoutUiRules

export {
    getAvailableAxes,
    getDisallowedDimensions,
    getAxisMaxNumberOfItems,
    getAxisMaxNumberOfDimensions,
    getAxisMinNumberOfDimensions,
    hasAxisTooManyItems,
    getAxisPerLockedDimension,
    getAllLockedDimensionIds,
    canDimensionBeAddedToAxis,
    isDimensionLocked,
    isAxisFull,
    getTransferableDimension,
} from './modules/layoutUiRules'

// Visualizations

export { createVisualization } from './visualizations'

// Utils: colorSets
export {
    COLOR_SET_DEFAULT,
    COLOR_SET_BRIGHT,
    COLOR_SET_DARK,
    COLOR_SET_GRAY,
    COLOR_SET_COLOR_BLIND,
    COLOR_SET_MONO_PATTERNS,
    colorSets,
} from './visualizations/util/colors/colorSets'
