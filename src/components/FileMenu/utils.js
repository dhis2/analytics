import i18n from '@dhis2/d2-i18n'
import { getDisplayNameByVisType } from '../../modules/visTypes.js'

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

export const appPathFor = (fileType, id, apiVersion) => {
    switch (fileType) {
        case FILE_TYPE_VISUALIZATION:
            return `dhis-web-data-visualizer/#/${id}`
        case FILE_TYPE_MAP:
            return `dhis-web-maps/#/${id}`
        case FILE_TYPE_EVENT_VISUALIZATION:
            // VERSION-TOGGLE: remove when 42 is the lowest supported version
            return apiVersion >= 42
                ? `dhis-web-line-listing/#/${id}`
                : `api/apps/line-listing/#/${id}`
        default:
            return `${window.location.search}${window.location.hash}`
    }
}

export const preparePayloadForSaveAs = ({
    visualization,
    name,
    description,
}) => {
    delete visualization.id
    delete visualization.created
    delete visualization.createdBy
    delete visualization.user

    visualization.name =
        name ||
        visualization.name ||
        i18n.t('Untitled {{visualizationType}}, {{date}}', {
            visualizationType: getDisplayNameByVisType(visualization.type),
            date: new Date().toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
            }),
        })

    visualization.description =
        description !== undefined ? description : visualization.description

    return visualization
}

export const preparePayloadForSave = ({ visualization, name, description }) => {
    visualization.name =
        name ||
        visualization.name ||
        i18n.t('Untitled {{visualizationType}}, {{date}}', {
            visualizationType: getDisplayNameByVisType(visualization.type),
            date: new Date().toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
            }),
        })

    visualization.description =
        description !== undefined ? description : visualization.description

    delete visualization.displayName
    delete visualization.displayDescription

    return visualization
}
