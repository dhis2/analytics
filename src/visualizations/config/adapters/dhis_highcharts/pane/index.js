import getGauge from './gauge'
import { CHART_TYPE_GAUGE } from '../type'

export default function(type) {
    switch (type) {
        case CHART_TYPE_GAUGE:
            return getGauge()
        default:
            return undefined
    }
}
