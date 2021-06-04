import i18n from '../locales/index.js'

export const CHART_AGGREGATE_AGGREGATABLE_TYPES = [
    'BOOLEAN',
    'TRUE_ONLY',
    'INTEGER',
    'INTEGER_POSITIVE',
    'INTEGER_NEGATIVE',
    'INTEGER_ZERO_OR_POSITIVE',
    'NUMBER',
    'UNIT_INTERVAL',
    'PERCENTAGE',
]

export const ALL_ID = 'ALL'

export const INDICATORS = 'INDICATOR'
export const DATA_ELEMENTS = 'DATA_ELEMENT'
export const DATA_SETS = 'DATA_SET'
export const EVENT_DATA_ITEMS = 'EVENT_DATA_ITEM'
export const PROGRAM_INDICATORS = 'PROGRAM_INDICATOR'
export const PROGRAM_DATA_ELEMENT = 'PROGRAM_DATA_ELEMENT'
export const PROGRAM_ATTRIBUTE = 'PROGRAM_ATTRIBUTE'
export const DATA_ELEMENT_OPERAND = 'DATA_ELEMENT_OPERAND'

export const TOTALS = 'totals'
export const DETAIL = 'detail'

export const SUB_GROUP_DETAIL = 'DETAIL'
export const SUB_GROUP_METRIC = 'METRIC'

const getProgramText = () => i18n.t('Program')
const getSelectProgramText = () => i18n.t('Select a program')

export const dataTypes = {
    [INDICATORS]: {
        id: INDICATORS,
        getName: () => i18n.t('Indicators'),
        getGroupLabel: () => i18n.t('Indicator group'),
        defaultGroup: { id: ALL_ID, getName: () => i18n.t('All groups') },
        getItemName: () => i18n.t('Indicator'),
        getGroupEmptyLabel: () => i18n.t('No indicator groups found'),
        getGroupLoadingLabel: () => i18n.t('Loading indicator groups'),
    },
    [DATA_ELEMENTS]: {
        id: DATA_ELEMENTS,
        getName: () => i18n.t('Data elements'),
        getGroupLabel: () => i18n.t('Data element group'),
        defaultGroup: {
            id: ALL_ID,
            getName: () => i18n.t('All groups'),
        },
        subGroup: SUB_GROUP_DETAIL,
        getItemName: () => i18n.t('Data element'),
        getGroupEmptyLabel: () => i18n.t('No data element groups found'),
        getGroupLoadingLabel: () => i18n.t('Loading data element groups'),
    },
    [DATA_SETS]: {
        id: DATA_SETS,
        getName: () => i18n.t('Data sets'),
        getGroupLabel: () => i18n.t('Data set'),
        defaultGroup: { id: ALL_ID, getName: () => i18n.t('All data sets') },
        subGroup: SUB_GROUP_METRIC,
        getItemName: () => i18n.t('Data set'),
        getGroupEmptyLabel: () => i18n.t('No data sets found'),
        getGroupLoadingLabel: () => i18n.t('Loading data sets'),
    },
    [EVENT_DATA_ITEMS]: {
        id: EVENT_DATA_ITEMS,
        getName: () => i18n.t('Event data items'),
        getGroupLabel: getProgramText,
        getPlaceholder: getSelectProgramText,
        defaultGroup: { id: ALL_ID, getName: () => i18n.t('All programs') },
        getItemName: () => i18n.t('Event data item'),
        getGroupEmptyLabel: () => i18n.t('No programs found'),
        getGroupLoadingLabel: () => i18n.t('Loading programs'),
    },
    [PROGRAM_INDICATORS]: {
        id: PROGRAM_INDICATORS,
        getName: () => i18n.t('Program indicators'),
        getGroupLabel: getProgramText,
        getPlaceholder: getSelectProgramText,
        defaultGroup: { id: ALL_ID, getName: () => i18n.t('All programs') },
        getItemName: () => i18n.t('Program indicator'),
        getGroupEmptyLabel: () => i18n.t('No programs found'),
        getGroupLoadingLabel: () => i18n.t('Loading programs'),
    },
}

export function defaultGroupId(dataType) {
    return dataTypes[dataType].defaultGroup
        ? dataTypes[dataType].defaultGroup.id
        : ''
}

export function defaultGroupDetail(dataType) {
    return dataTypes[dataType].groupDetail
        ? dataTypes[dataType].groupDetail.default
        : ''
}

export const DEFAULT_DATATYPE_ID = INDICATORS
