import i18n from '../locales/index.js'

export const DIMENSION_TYPE_ALL = 'ALL'
export const DIMENSION_TYPE_INDICATOR = 'INDICATOR'
export const DIMENSION_TYPE_DATA_ELEMENT = 'DATA_ELEMENT'
export const DIMENSION_TYPE_DATA_SET = 'DATA_SET'
export const DIMENSION_TYPE_EVENT_DATA_ITEM = 'EVENT_DATA_ITEM'
export const DIMENSION_TYPE_PROGRAM_INDICATOR = 'PROGRAM_INDICATOR'
export const DIMENSION_TYPE_PROGRAM_DATA_ELEMENT = 'PROGRAM_DATA_ELEMENT'
export const DIMENSION_TYPE_PROGRAM_ATTRIBUTE = 'PROGRAM_ATTRIBUTE'
export const DIMENSION_TYPE_DATA_ELEMENT_OPERAND = 'DATA_ELEMENT_OPERAND'
export const DIMENSION_TYPE_CATEGORY = 'CATEGORY'
export const DIMENSION_TYPE_CATEGORY_OPTION_GROUP_SET =
    'CATEGORY_OPTION_GROUP_SET'
export const DIMENSION_TYPE_DATA_ELEMENT_GROUP_SET = 'DATA_ELEMENT_GROUP_SET'
export const DIMENSION_TYPE_DATA = 'DATA_X'
export const DIMENSION_TYPE_PERIOD = 'PERIOD'
export const DIMENSION_TYPE_ORGANISATION_UNIT = 'ORGANISATION_UNIT'
export const DIMENSION_TYPE_ORGANISATION_UNIT_GROUP_SET =
    'ORGANISATION_UNIT_GROUP_SET'
export const DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM =
    'EXPRESSION_DIMENSION_ITEM'

export const TOTALS = 'totals'
export const DETAIL = 'detail'

export const SUB_GROUP_DETAIL = 'DETAIL'
export const SUB_GROUP_METRIC = 'METRIC'

const getProgramText = () => i18n.t('Program')
const getSelectProgramText = () => i18n.t('Select a program')

export const dataTypeMap = {
    [DIMENSION_TYPE_INDICATOR]: {
        id: DIMENSION_TYPE_INDICATOR,
        getName: () => i18n.t('Indicators'),
        getGroupLabel: () => i18n.t('Indicator group'),
        defaultGroup: {
            id: DIMENSION_TYPE_ALL,
            getName: () => i18n.t('All groups'),
        },
        getItemName: () => i18n.t('Indicator'),
        getGroupEmptyLabel: () => i18n.t('No indicator groups found'),
        getGroupLoadingLabel: () => i18n.t('Loading indicator groups'),
    },
    [DIMENSION_TYPE_DATA_ELEMENT]: {
        id: DIMENSION_TYPE_DATA_ELEMENT,
        getName: () => i18n.t('Data elements'),
        getGroupLabel: () => i18n.t('Data element group'),
        defaultGroup: {
            id: DIMENSION_TYPE_ALL,
            getName: () => i18n.t('All groups'),
        },
        subGroup: SUB_GROUP_DETAIL,
        getItemName: () => i18n.t('Data element'),
        getGroupEmptyLabel: () => i18n.t('No data element groups found'),
        getGroupLoadingLabel: () => i18n.t('Loading data element groups'),
    },
    [DIMENSION_TYPE_DATA_SET]: {
        id: DIMENSION_TYPE_DATA_SET,
        getName: () => i18n.t('Data sets'),
        getGroupLabel: () => i18n.t('Data set'),
        defaultGroup: {
            id: DIMENSION_TYPE_ALL,
            getName: () => i18n.t('All data sets'),
        },
        subGroup: SUB_GROUP_METRIC,
        getItemName: () => i18n.t('Data set'),
        getGroupEmptyLabel: () => i18n.t('No data sets found'),
        getGroupLoadingLabel: () => i18n.t('Loading data sets'),
    },
    [DIMENSION_TYPE_EVENT_DATA_ITEM]: {
        id: DIMENSION_TYPE_EVENT_DATA_ITEM,
        getName: () => i18n.t('Event data items'),
        getGroupLabel: getProgramText,
        getPlaceholder: getSelectProgramText,
        defaultGroup: {
            id: DIMENSION_TYPE_ALL,
            getName: () => i18n.t('All programs'),
        },
        getItemName: () => i18n.t('Event data item'),
        getGroupEmptyLabel: () => i18n.t('No programs found'),
        getGroupLoadingLabel: () => i18n.t('Loading programs'),
    },
    [DIMENSION_TYPE_PROGRAM_INDICATOR]: {
        id: DIMENSION_TYPE_PROGRAM_INDICATOR,
        getName: () => i18n.t('Program indicators'),
        getGroupLabel: getProgramText,
        getPlaceholder: getSelectProgramText,
        defaultGroup: {
            id: DIMENSION_TYPE_ALL,
            getName: () => i18n.t('All programs'),
        },
        getItemName: () => i18n.t('Program indicator'),
        getGroupEmptyLabel: () => i18n.t('No programs found'),
        getGroupLoadingLabel: () => i18n.t('Loading programs'),
    },
    [DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM]: {
        id: DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM,
        getName: () => i18n.t('Calculations'),
        getItemName: () => i18n.t('Calculation'),
    },
}

export function defaultGroupId(dataType) {
    return dataTypeMap[dataType].defaultGroup
        ? dataTypeMap[dataType].defaultGroup.id
        : ''
}

export function defaultGroupDetail(dataType) {
    return dataTypeMap[dataType].groupDetail
        ? dataTypeMap[dataType].groupDetail.default
        : ''
}

export const DEFAULT_DATATYPE_ID = DIMENSION_TYPE_INDICATOR
