import getGauge from './gauge'
import { VIS_TYPE_GAUGE } from '../../../../../modules/visTypes'

export default function(type) {
    switch (type) {
        case VIS_TYPE_GAUGE:
            return getGauge()
        default:
            return undefined
    }
}
