import { getOutliersByQuartile } from './quartile'

const QUARTILE = 'QUARTILE'

export const getOutliers = (
    data,
    config = { method: 'QUARTILE', thresholdFactor: 1.5 }
) => {
    switch (method) {
        case QUARTILE:
        default:
            return getOutliersByQuartile(data, config)
    }
}
