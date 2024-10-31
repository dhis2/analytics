import { VIS_TYPE_SINGLE_VALUE } from '../../../../../modules/visTypes.js'
import getSingleValueCustomSVGOptions from './singleValue/index.js'

export default function getCustomSVGOptions({
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
