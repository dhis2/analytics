import { getStdDevHelper } from './stdDev'
import { getQuartileHelper } from './quartile'

const QUARTILE = 'QUARTILE'
const STDDEV = 'STDDEV'

export const getOutlierHelper = (
    data,
    config = { method: 'QUARTILE', thresholdFactor: 1.5 }
) => {
    switch (config.method) {
        case STDDEV:
            return getStdDevHelper(data, config)
        case QUARTILE:
        default:
            return getQuartileHelper(data, config)
    }
}
