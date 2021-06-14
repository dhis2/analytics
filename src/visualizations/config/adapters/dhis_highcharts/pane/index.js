import { VIS_TYPE_GAUGE } from '../../../../../modules/visTypes'
import getGauge from './gauge'

export default function (type) {
    switch (type) {
        case VIS_TYPE_GAUGE:
            return getGauge()
        default:
            return undefined
    }
}
