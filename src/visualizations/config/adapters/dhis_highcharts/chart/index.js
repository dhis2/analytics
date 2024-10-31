import { VIS_TYPE_SINGLE_VALUE } from '../../../../../modules/visTypes.js'
import getDefaultChart from './default.js'
import getSingleValueChart from './singleValue.js'

export default function getChart(layout, el, extraOptions, series) {
    switch (layout.type) {
        case VIS_TYPE_SINGLE_VALUE:
            return getSingleValueChart(layout, el, extraOptions, series)
        default:
            return getDefaultChart(layout, el, extraOptions)
    }
}
