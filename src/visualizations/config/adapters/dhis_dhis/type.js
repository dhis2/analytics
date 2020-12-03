import { VIS_TYPE_SINGLE_VALUE } from '../../../../modules/visTypes'

export default function(type) {
    switch (type) {
        case VIS_TYPE_SINGLE_VALUE:
            return { type: VIS_TYPE_SINGLE_VALUE }
        default:
            return { type: VIS_TYPE_SINGLE_VALUE }
    }
}
