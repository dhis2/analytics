import './locales/index.js'
// Components

export { default as DataDimension } from './components/DataDimension/DataDimension.js'

export { default as PeriodDimension } from './components/PeriodDimension/PeriodDimension.js'
export { default as FixedPeriodSelect } from './components/PeriodDimension/FixedPeriodSelect.js'

export { default as OrgUnitDimension } from './components/OrgUnitDimension/OrgUnitDimension.js'

export {
    default as DynamicDimension,
    ALL_DYNAMIC_DIMENSION_ITEMS,
} from './components/DynamicDimension/DynamicDimension.js'

export { default as DimensionsPanel } from './components/DimensionsPanel/DimensionsPanel.js'
export { default as DimensionItem } from './components/DimensionsPanel/List/DimensionItem.js'
export { default as DimensionFilter } from './components/Filter/Filter.js'

export { default as DimensionMenu } from './components/DimensionMenu.js'

export { default as PivotTable } from './components/PivotTable/PivotTable.js'

export { default as FileMenu } from './components/FileMenu/FileMenu.js'

export { default as VisTypeIcon } from './components/VisTypeIcon.js'

export { default as LegendKey } from './components/LegendKey/LegendKey.js'

export { default as AboutAOUnit } from './components/AboutAOUnit/AboutAOUnit.js'

export { InterpretationsUnit } from './components/Interpretations/InterpretationsUnit/InterpretationsUnit.js'
export { InterpretationModal } from './components/Interpretations/InterpretationModal/InterpretationModal.js'

export { TranslationDialog } from './components/TranslationDialog/index.js'

export {
    CachedDataQueryProvider,
    useCachedDataQuery,
} from './components/CachedDataQueryProvider.js'

// Api

export { default as Analytics } from './api/analytics/Analytics.js'
export {
    apiFetchDimensions,
    apiFetchRecommendedIds,
    apiFetchItemsByDimension,
} from './api/dimensions.js'
export {
    apiFetchOrganisationUnitLevels,
    apiFetchOrganisationUnitRoots,
    apiFetchOrganisationUnit,
} from './api/organisationUnits.js'

// Modules: axis

export {
    getAxisName,
    getAxisNameByLayoutType,
    hasCustomAxes,
} from './modules/axis.js'

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
} from './modules/predefinedDimensions.js'

// Modules: ou utils

export {
    ouIdHelper,
    USER_ORG_UNIT,
    USER_ORG_UNIT_CHILDREN,
    USER_ORG_UNIT_GRANDCHILDREN,
} from './modules/ouIdHelper/index.js'
export { convertOuLevelsToUids } from './modules/ouLevelUtils/index.js'

// Modules: adapted ui layout

export { getAdaptedUiLayoutByType } from './modules/getAdaptedUiLayoutByType.js'

// Modules: relativeItems

export { hasRelativeItems } from './modules/relativeItems/index.js'

// Modules: layout

export { LAYOUT } from './modules/layout/layout.js'
export { layoutFilterDimensions } from './modules/layout/layoutFilterDimensions.js'
export { layoutGetAllAxes } from './modules/layout/layoutGetAllAxes.js'
export { layoutGetAllDimensions } from './modules/layout/layoutGetAllDimensions.js'
export { layoutGetAllItemIds } from './modules/layout/layoutGetAllItemIds.js'
export { layoutGetAllItems } from './modules/layout/layoutGetAllItems.js'
export { layoutGetAxisIdDimensionIdsObject } from './modules/layout/layoutGetAxisIdDimensionIdsObject.js'
export { layoutGetDimension } from './modules/layout/layoutGetDimension.js'
export { layoutGetDimensionItems } from './modules/layout/layoutGetDimensionItems.js'
export { layoutReplaceDimension } from './modules/layout/layoutReplaceDimension.js'
export { layoutGetDimensionIdItemIdsObject } from './modules/layout/layoutGetDimensionIdItemIdsObject.js'
export { layoutHasDataDimension } from './modules/layout/layoutHasDataDimension.js'
export { layoutHasDimension } from './modules/layout/layoutHasDimension.js'
export { layoutHasDynamicDimension } from './modules/layout/layoutHasDynamicDimension.js'
export { layoutHasPeriodDimension } from './modules/layout/layoutHasPeriodDimension.js'

// Modules: valueTypes
export {
    VALUE_TYPE_NUMBER,
    VALUE_TYPE_UNIT_INTERVAL,
    VALUE_TYPE_PERCENTAGE,
    VALUE_TYPE_INTEGER,
    VALUE_TYPE_INTEGER_POSITIVE,
    VALUE_TYPE_INTEGER_NEGATIVE,
    VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE,
    VALUE_TYPE_TEXT,
    VALUE_TYPE_LONG_TEXT,
    VALUE_TYPE_LETTER,
    VALUE_TYPE_PHONE_NUMBER,
    VALUE_TYPE_EMAIL,
    VALUE_TYPE_USERNAME,
    VALUE_TYPE_URL,
    VALUE_TYPE_BOOLEAN,
    VALUE_TYPE_TRUE_ONLY,
    VALUE_TYPE_DATE,
    VALUE_TYPE_TIME,
    VALUE_TYPE_DATETIME,
    VALUE_TYPE_ORGANISATION_UNIT,
} from './modules/valueTypes.js'

export {
    AXIS,
    AXIS_ID_COLUMNS,
    AXIS_ID_ROWS,
    AXIS_ID_FILTERS,
    DEFAULT_AXIS_IDS,
} from './modules/layout/axis.js'
export { axisGetAllItems } from './modules/layout/axisGetAllItems.js'
export { axisGetDimension } from './modules/layout/axisGetDimension.js'
export { axisGetDimensionIds } from './modules/layout/axisGetDimensionIds.js'
export { axisHasDataDimension } from './modules/layout/axisHasDataDimension.js'
export { axisHasDimension } from './modules/layout/axisHasDimension.js'
export { axisHasPeriodDimension } from './modules/layout/axisHasPeriodDimension.js'
export { axisHasOuDimension } from './modules/layout/axisHasOuDimension.js'
export { axisIsEmpty } from './modules/layout/axisIsEmpty.js'

export {
    DIMENSION,
    DIMENSION_PROP_ID,
    DIMENSION_PROP_ITEMS,
    DIMENSION_PROPS,
} from './modules/layout/dimension.js'
export { dimensionCreate } from './modules/layout/dimensionCreate.js'
export { dimensionGetId } from './modules/layout/dimensionGetId.js'
export { dimensionGetItemIds } from './modules/layout/dimensionGetItemIds.js'
export { dimensionGetItems } from './modules/layout/dimensionGetItems.js'
export { dimensionIs } from './modules/layout/dimensionIs.js'
export { dimensionIsEmpty } from './modules/layout/dimensionIsEmpty.js'
export { dimensionIsValid } from './modules/layout/dimensionIsValid.js'

export { ITEM, ITEM_PROP_ID, ITEM_PROPS } from './modules/layout/item.js'
export { itemGetId } from './modules/layout/itemGetId.js'
export { itemIsValid } from './modules/layout/itemIsValid.js'

// Modules: visTypeToLayoutType

export { getLayoutTypeByVisType } from './modules/visTypeToLayoutType.js'

// Modules: visTypes

export {
    VIS_TYPE_GROUP_ALL,
    VIS_TYPE_GROUP_CHARTS,
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
    VIS_TYPE_SCATTER,
    VIS_TYPE_LINE_LIST,
    visTypeDisplayNames,
    visTypeIcons,
    getDisplayNameByVisType,
    defaultVisType,
    isStacked,
    isMultiType,
    isYearOverYear,
    isDualAxisType,
    isSingleValue,
    isTwoCategoryChartType,
    isLegendSetType,
    isColumnBasedType,
    isVerticalType,
} from './modules/visTypes.js'

// Modules: layoutTypes

export {
    LAYOUT_TYPE_DEFAULT,
    LAYOUT_TYPE_PIE,
    LAYOUT_TYPE_SINGLE_VALUE,
    LAYOUT_TYPE_YEAR_OVER_YEAR,
    LAYOUT_TYPE_PIVOT_TABLE,
    LAYOUT_TYPE_SCATTER,
    LAYOUT_TYPE_LINE_LIST,
} from './modules/layoutTypes.js'

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
} from './modules/layoutUiRules/index.js'

// Visualizations

export { createVisualization } from './visualizations/index.js'

// Modules: fontStyle

export {
    FONT_STYLE_VISUALIZATION_TITLE,
    FONT_STYLE_VISUALIZATION_SUBTITLE,
    FONT_STYLE_HORIZONTAL_AXIS_TITLE,
    FONT_STYLE_VERTICAL_AXIS_TITLE,
    FONT_STYLE_LEGEND,
    FONT_STYLE_AXIS_LABELS,
    FONT_STYLE_REGRESSION_LINE_LABEL,
    FONT_STYLE_OPTION_FONT,
    FONT_STYLE_OPTION_FONT_SIZE,
    FONT_STYLE_OPTION_BOLD,
    FONT_STYLE_OPTION_ITALIC,
    FONT_STYLE_OPTION_UNDERLINE,
    FONT_STYLE_OPTION_TEXT_COLOR,
    FONT_STYLE_OPTION_TEXT_ALIGN,
    TEXT_ALIGN_LEFT,
    TEXT_ALIGN_CENTER,
    TEXT_ALIGN_RIGHT,
    defaultFontStyle,
    getFontSizeOptions,
    getTextAlignOptions,
    deleteFontStyleOption,
} from './modules/fontStyle.js'

// Modules: legend

export {
    LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM,
    LEGEND_DISPLAY_STRATEGY_FIXED,
    LEGEND_DISPLAY_STYLE_FILL,
    LEGEND_DISPLAY_STYLE_TEXT,
    getColorByValueFromLegendSet,
} from './modules/legends.js'

// Modules: general

export { renderValue as formatValue } from './modules/renderValue.js'

// Utils: colorSets
export {
    COLOR_SET_DEFAULT,
    COLOR_SET_BASIC,
    COLOR_SET_EXTENDED,
    COLOR_SET_BRIGHT,
    COLOR_SET_DARK,
    COLOR_SET_GRAY,
    COLOR_SET_COLOR_BLIND,
    COLOR_SET_PATTERNS,
    colorSets,
} from './visualizations/util/colors/colorSets.js'

// Utils: periods
export {
    DAILY,
    WEEKLY,
    WEEKLYWED,
    WEEKLYTHU,
    WEEKLYSAT,
    WEEKLYSUN,
    WEEKS_THIS_YEAR,
    BIWEEKLY,
    MONTHLY,
    BIMONTHLY,
    QUARTERLY,
    SIXMONTHLY,
    SIXMONTHLYAPR,
    YEARLY,
    FINANCIAL,
    FYNOV,
    FYOCT,
    FYJUL,
    FYAPR,
} from './components/PeriodDimension/utils/index.js'
export { getRelativePeriodsOptionsById } from './components/PeriodDimension/utils/relativePeriods.js'
export { getFixedPeriodsOptionsById } from './components/PeriodDimension/utils/fixedPeriods.js'

export { default as VisualizationOptions } from './components/Options/VisualizationOptions.js'

export {
    DIMENSION_TYPE_INDICATOR,
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_DATA_SET,
    DIMENSION_TYPE_EVENT_DATA_ITEM,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
    DIMENSION_TYPE_PROGRAM_DATA_ELEMENT,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    DIMENSION_TYPE_DATA_ELEMENT_OPERAND,
    DIMENSION_TYPE_CATEGORY,
    DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET,
    DIMENSION_TYPE_ALL,
    DIMENSION_TYPE_DATA,
    DIMENSION_TYPE_DATA_ELEMENT_GROUP_SET,
    DIMENSION_TYPE_ORGANISATION_UNIT,
    DIMENSION_TYPE_PERIOD,
    DIMENSION_TYPE_ORGANISATION_UNIT_GROUP_SET,
} from './modules/dataTypes.js'
