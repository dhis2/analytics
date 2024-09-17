import { VIS_TYPE_SINGLE_VALUE } from '../../../../../modules/visTypes.js'
import { getSingleValueCustomSVGOptions } from './singleValue/index.js'
import { renderSingleValueSVG } from './singleValue/renderer/renderSingleValueSVG.js'

export function renderCustomSVG() {
    const { visualizationType } = this.userOptions.customSVGOptions

    switch (visualizationType) {
        case VIS_TYPE_SINGLE_VALUE:
            renderSingleValueSVG.call(this)
            break
        default:
            break
    }
}

export function getCustomSVGOptions({
    extraConfig,
    layout,
    extraOptions,
    metaData,
    series,
}) {
    const baseOptions = {
        visualizationType: layout.type,
    }
    switch (layout.type) {
        case VIS_TYPE_SINGLE_VALUE:
            return {
                ...baseOptions,
                ...getSingleValueCustomSVGOptions({
                    extraConfig,
                    layout,
                    extraOptions,
                    metaData,
                    series,
                }),
            }
        default:
            break
    }
}
