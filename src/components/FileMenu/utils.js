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
        case FILE_TYPE_EVENT_VISUALIZATION:
            return 'line list'
        case FILE_TYPE_EVENT_REPORT:
            return 'event report'
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
        default:
            return
    }
}
