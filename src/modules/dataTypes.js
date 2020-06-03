import i18n from '@dhis2/d2-i18n'

import { DATA_SETS_CONSTANTS } from '../modules/dataSets'

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

const INDICATORS = 'indicators'
const DATA_ELEMENTS = 'dataElements'
const DATA_SETS = 'dataSets'
const EVENT_DATA_ITEMS = 'eventDataItems'
const PROGRAM_INDICATORS = 'programIndicators'

export const TOTALS = 'totals'
export const DETAIL = 'detail'

const getProgramText = () => i18n.t('Program')
const getSelectProgramText = () => i18n.t('Select a program')

export const dataTypes = {
    [INDICATORS]: {
        id: INDICATORS,
        getName: () => i18n.t('Indicators'),
        getGroupLabel: () => i18n.t('Select indicator group'),
        defaultGroup: { id: ALL_ID, getName: () => i18n.t('[ All groups ]') },
        groupDetail: false,
    },
    [DATA_ELEMENTS]: {
        id: DATA_ELEMENTS,
        getName: () => i18n.t('Data elements'),
        getGroupLabel: () => i18n.t('Select data element group'),
        defaultGroup: {
            id: ALL_ID,
            getName: () => i18n.t('[ All data elements ]'),
        },
        groupDetail: { default: TOTALS },
    },
    [DATA_SETS]: {
        id: DATA_SETS,
        getName: () => i18n.t('Data sets'),
        getGroupLabel: () => i18n.t('Select data sets'),
        defaultGroup: { id: ALL_ID, getName: () => i18n.t('[ All metrics ]') },
        groupDetail: false,
        augmentAlternatives: (alternatives, groupId) =>
            getReportingRates(alternatives, groupId),
    },
    [EVENT_DATA_ITEMS]: {
        id: EVENT_DATA_ITEMS,
        getName: () => i18n.t('Event data items'),
        getGroupLabel: getProgramText,
        getPlaceholder: getSelectProgramText,
        defaultGroup: null,
        groupDetail: false,
    },
    [PROGRAM_INDICATORS]: {
        id: PROGRAM_INDICATORS,
        getName: () => i18n.t('Program indicators'),
        getGroupLabel: getProgramText,
        getPlaceholder: getSelectProgramText,
        defaultGroup: null,
        groupDetail: false,
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

const getReportingRates = (contents, groupSetId) => {
    let dataSets = []

    if (groupSetId === ALL_ID) {
        DATA_SETS_CONSTANTS.forEach(
            reportingRate =>
                (dataSets = [
                    ...dataSets,
                    ...contents.map(dataSet =>
                        concatReportingRate(dataSet, reportingRate)
                    ),
                ])
        )
    } else {
        const reportingRateIndex = DATA_SETS_CONSTANTS.find(
            item => item.id === groupSetId
        )

        dataSets = contents.map(dataSet =>
            concatReportingRate(dataSet, reportingRateIndex)
        )
    }

    return dataSets
}

const concatReportingRate = (dataSet, reportingRate) => {
    return {
        id: `${dataSet.id}.${reportingRate.id}`,
        name: `${dataSet.name} (${reportingRate.getName()})`,
    }
}
