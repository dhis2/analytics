import { VIS_TYPE_SINGLE_VALUE } from '../../../../../../modules/visTypes.js'
import loadSingleValueSVG from './singleValue/index.js'

export default function loadCustomSVG(visType) {
    switch (visType) {
        case VIS_TYPE_SINGLE_VALUE:
            loadSingleValueSVG.call(this)
            break
        default:
            break
    }
}
