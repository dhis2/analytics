import { getV42PeriodTypeOptions } from './versions/v42.js'
import { getV43PeriodTypeOptions } from './versions/v43.js'
import { getV44PeriodTypeOptions } from './versions/v44.js'

const getPeriodTypeOptions = ({
    enabledPeriodTypesData,
    periodsSettings,
    excludedPeriodTypes,
}) => {
    switch (enabledPeriodTypesData?.version) {
        case 44:
            return getV44PeriodTypeOptions({
                enabledPeriodTypesData,
                periodsSettings,
                excludedPeriodTypes,
            })
        case 43:
            return getV43PeriodTypeOptions({
                enabledPeriodTypesData,
                periodsSettings,
                excludedPeriodTypes,
            })
        default:
            return getV42PeriodTypeOptions({
                periodsSettings,
                excludedPeriodTypes,
            })
    }
}

export { getPeriodTypeOptions }
