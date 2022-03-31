import i18n from '@dhis2/d2-i18n'

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
    [NO_TYPE]: {
        modalTitle: i18n.t('Open'),
        loadingText: i18n.t('Loading'),
        errorTitle: i18n.t("Couldn't load items"),
        errorText: i18n.t(
            'There was a problem loading items. Try again or contact your system administrator.'
        ),
        noDataText: i18n.t('No items found. Create a new to get started.'),
        noFilteredDataText: i18n.t(
            "No items found. Try adjusting your search or filter options to find what you're looking for."
        ),
        newButtonLabel: i18n.t('Create new'),
    },

    [AO_TYPE_VISUALIZATION]: {
        modalTitle: i18n.t('Open a visualization'),
        loadingText: i18n.t('Loading visualizations'),
        errorTitle: i18n.t("Couldn't load visualizations"),
        errorText: i18n.t(
            'There was a problem loading visualizations. Try again or contact your system administrator.'
        ),
        noDataText: i18n.t(
            'No visualizations found. Click New visualization to get started.'
        ),
        noFilteredDataText: i18n.t(
            "No visualizations found. Try adjusting your search or filter options to find what you're looking for."
        ),
        newButtonLabel: i18n.t('New visualization'),
    },
    [AO_TYPE_MAP]: {
        modalTitle: i18n.t('Open a map'),
        loadingText: i18n.t('Loading maps'),
        errorTitle: i18n.t("Couldn't load maps"),
        errorText: i18n.t(
            'There was a problem loading maps. Try again or contact your system administrator.'
        ),
        noDataText: i18n.t('No maps found. Click New map to get started.'),
        noFilteredDataText: i18n.t(
            "No maps found. Try adjusting your search or filter options to find what you're looking for."
        ),
        newButtonLabel: i18n.t('New map'),
    },
    [AO_TYPE_EVENT_VISUALIZATION]: {
        modalTitle: i18n.t('Open a line list'),
        loadingText: i18n.t('Loading line lists'),
        errorTitle: i18n.t("Couldn't load line lists"),
        errorText: i18n.t(
            'There was a problem loading line lists. Try again or contact your system administrator.'
        ),
        noDataText: i18n.t(
            'No line lists found. Click New line list to get started.'
        ),
        noFilteredDataText: i18n.t(
            "No line lists found. Try adjusting your search or filter options to find what you're looking for."
        ),
        newButtonLabel: i18n.t('New line list'),
    },
}

export const getTranslatedString = (type, key) =>
    (texts[type] || texts[NO_TYPE])[key]
