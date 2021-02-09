export const supportedFileTypes = ['visualization', 'map']

export const endpointFromFileType = fileType => {
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
            return
    }
}
