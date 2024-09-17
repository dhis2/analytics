import { computeSpacingTop } from './computeSpacingTop.js'
import { MIN_SIDE_WHITESPACE } from './styles.js'

export function getAvailableSpace(valueSpacingTop) {
    return {
        height:
            this.chartHeight - computeSpacingTop.call(this, valueSpacingTop),
        width: this.chartWidth - MIN_SIDE_WHITESPACE * 2,
    }
}
