import isArray from 'd2-utilizr/lib/isArray'
import Config from './config/index.js'
import Store from './store/index.js'

const defaultError = error => {
    throw new Error(error)
}

const defaultWarning = warning => {
    console.log(warning)
}

function createVisualization(
    data,
    layout,
    el,
    extraOptions,
    error = defaultError,
    warning = defaultWarning,
    outputFormat
) {
    const _data = isArray(data) ? data : [data]
    const store = new Store({ data: _data, error, warning, outputFormat })
    const config = new Config({
        store,
        layout,
        el,
        outputFormat,
        extraOptions,
        error,
        warning,
    })

    return {
        store,
        config,
        visualization: config.createVisualization(),
    }
}

export { Store, Config, createVisualization }

export default createVisualization
