import i18n from '../../locales/index.js'

export const AO_TYPE_VISUALIZATION = 'visualization'
export const AO_TYPE_MAP = 'map'
export const AO_TYPE_EVENT_VISUALIZATION = 'eventVisualization'

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
    [NO_TYPE]: {
        unitTitle: i18n.t('About this visualization'),
    },
}

export const getTranslatedString = (type, key) =>
    (texts[type] || texts[NO_TYPE])[key]
