import { VIS_TYPE_SINGLE_VALUE } from '../../../../../modules/visTypes.js'

export function renderCustomSVG() {
    const renderer = this.renderer
    const options = this.userOptions.customSVGOptions

    switch (options.visualizationType) {
        case VIS_TYPE_SINGLE_VALUE:
            console.log('now render SV viz', renderer, options)
            break
        default:
            break
    }
}

export function getCustomSVGOptions({ layout }) {
    const baseOptions = {
        visualizationType: layout.type,
    }
    switch (layout.type) {
        case VIS_TYPE_SINGLE_VALUE:
            return {
                ...baseOptions,
                test: 1,
            }
        default:
            return null
    }
}
