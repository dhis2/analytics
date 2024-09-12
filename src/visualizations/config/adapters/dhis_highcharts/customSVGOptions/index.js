import { VIS_TYPE_SINGLE_VALUE } from '../../../../../modules/visTypes.js'
import { getSingleValueCustomSVGOptions } from './singleValue/index.js'

export function renderCustomSVG() {
    const renderer = this.renderer
    const options = this.userOptions.customSVGOptions

    switch (options.visualizationType) {
        case VIS_TYPE_SINGLE_VALUE:
            console.log('now render SV viz', this)
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
