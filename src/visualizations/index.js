import isArray from 'd2-utilizr/lib/isArray'

import Store from './store'
import Config from './config'
import {
    defaultFontStyle,
    FONT_STYLE_LEGEND,
    mergeFontStyleWithDefault,
} from '../modules/fontStyle'

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
        layout: {
            ...layout,
            fontStyle: mergeFontStyleWithDefault(layout.fontStyle),
            legend: {
                ...layout.legend,
                label: {
                    fontStyle: {
                        ...defaultFontStyle[FONT_STYLE_LEGEND],
                        ...layout.legend?.label?.fontStyle,
                    },
                },
            },
            // FIXME: Move this to each use of fontStyle instead of keeping it centralised
        },
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
