import i18n from '../../locales/index.js'

export const FILE_TYPE_EVENT_REPORT = 'eventReport'
export const FILE_TYPE_VISUALIZATION = 'visualization'
export const FILE_TYPE_MAP = 'map'
export const FILE_TYPE_EVENT_VISUALIZATION = 'eventVisualization'

export const supportedFileTypes = [
    FILE_TYPE_EVENT_REPORT,
    FILE_TYPE_VISUALIZATION,
    FILE_TYPE_MAP,
    FILE_TYPE_EVENT_VISUALIZATION,
]

export const endpointFromFileType = (fileType) => `${fileType}s`

export const labelForFileType = (fileType) => {
    switch (fileType) {
        case FILE_TYPE_EVENT_REPORT:
            return i18n.t('event report')
        case FILE_TYPE_EVENT_VISUALIZATION:
            return i18n.t('line list')
        case FILE_TYPE_MAP:
            return i18n.t('map')
        case FILE_TYPE_VISUALIZATION:
            return i18n.t('visualization')
        default:
            return fileType
    }
}

export const appPathFor = (fileType, id) => {
    switch (fileType) {
        case FILE_TYPE_VISUALIZATION:
            return `dhis-web-data-visualizer/#/${id}`
        case FILE_TYPE_MAP:
            return `dhis-web-maps/index.html?id=${id}`
        case FILE_TYPE_EVENT_VISUALIZATION:
            return `api/apps/line-listing/#/${id}`
        default:
            return `${window.location.search}${window.location.hash}`
    }
}

export const preparePayloadForSaveAs = ({ ...visualization }) => {
    delete visualization.id
    delete visualization.created
    delete visualization.createdBy
    delete visualization.user

    return visualization
}
