import i18n from '@dhis2/d2-i18n'

export const AO_TYPE_VISUALIZATION = 'visualization'
export const AO_TYPE_MAP = 'map'
export const AO_TYPE_EVENT_VISUALIZATION = 'eventVisualization'
export const AO_TYPE_EVENT_CHART = 'eventChart'
export const AO_TYPE_EVENT_REPORT = 'eventReport'

export const AOTypeMap = {
    [AO_TYPE_VISUALIZATION]: {
        apiEndpoint: 'visualizations',
    },
    [AO_TYPE_MAP]: {
        apiEndpoint: 'maps',
    },
    [AO_TYPE_EVENT_VISUALIZATION]: {
        apiEndpoint: 'eventVisualizations',
    },
    [AO_TYPE_EVENT_CHART]: {
        apiEndpoint: 'eventCharts',
    },
    [AO_TYPE_EVENT_REPORT]: {
        apiEndpoint: 'eventReports',
    },
}

const NO_TYPE = 'NO_TYPE'

const texts = {
    [AO_TYPE_MAP]: {
        unitTitle: i18n.t('About this map'),
    },
    [AO_TYPE_EVENT_VISUALIZATION]: {
        unitTitle: i18n.t('About this line list'),
    },
    [AO_TYPE_VISUALIZATION]: {
        unitTitle: i18n.t('About this visualization'),
    },
    [AO_TYPE_EVENT_CHART]: {
        unitTitle: i18n.t('About this event chart'),
    },
    [AO_TYPE_EVENT_REPORT]: {
        unitTitle: i18n.t('About this event report'),
    },
    [NO_TYPE]: {
        unitTitle: i18n.t('About this visualization'),
    },
}

export const getTranslatedString = (type, key) =>
    (texts[type] || texts[NO_TYPE])[key]
