import getGauge from './gauge'
import { VIS_TYPE_GAUGE } from '../../../../../modules/visTypes'

export default function(type, extraOptions) {
    switch (type) {
        case VIS_TYPE_GAUGE:
            return getGauge(extraOptions.dashboard)
        default:
            return undefined
    }
}
