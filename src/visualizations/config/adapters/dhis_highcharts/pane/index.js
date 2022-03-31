import { VIS_TYPE_GAUGE } from '../../../../../modules/visTypes.js'
import getGauge from './gauge.js'

export default function (type) {
    switch (type) {
        case VIS_TYPE_GAUGE:
            return getGauge()
        default:
            return undefined
    }
}
