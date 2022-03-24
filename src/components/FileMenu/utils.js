export const supportedFileTypes = [
    'eventReport',
    'visualization',
    'map',
    'eventVisualization',
]

export const endpointFromFileType = (fileType) => {
    switch (fileType) {
        case 'visualization':
        case 'map':
        default:
            return `${fileType}s`
    }
}

export const appPathFor = (fileType, id) => {
    switch (fileType) {
        case 'visualization':
            return `dhis-web-data-visualizer/#/${id}`
        case 'map':
            return `dhis-web-maps/index.html?id=${id}`
        default:
            // strip origin and the first /
            return `${window.location.pathname}${window.location.search}${window.location.hash}`.substring(
                1
            )
    }
}
