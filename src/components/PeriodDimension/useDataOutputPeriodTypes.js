import { useConfig } from '@dhis2/app-runtime'
import { getV42PeriodTypeOptions } from './versions/v42.js'
import {
    getV43PeriodTypeOptions,
    useV43DataOutputPeriodTypes,
} from './versions/v43.js'
import {
    getV44PeriodTypeOptions,
    useV44DataOutputPeriodTypes,
} from './versions/v44.js'

const useDataOutputPeriodTypes = () => {
    const { serverVersion } = useConfig()
    const supportsEnabledPeriodTypes = serverVersion.minor >= 43
    const supportsPeriodLabelTranslations = serverVersion.minor >= 44

    const v43Data = useV43DataOutputPeriodTypes({
        enabled: supportsEnabledPeriodTypes && !supportsPeriodLabelTranslations,
    })
    const v44Data = useV44DataOutputPeriodTypes({
        enabled: supportsPeriodLabelTranslations,
    })

    return {
        supportsEnabledPeriodTypes,
        enabledPeriodTypesData: supportsPeriodLabelTranslations
            ? v44Data
            : v43Data,
    }
}

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
            })
        default:
            return getV42PeriodTypeOptions({
                periodsSettings,
                excludedPeriodTypes,
            })
    }
}

export { useDataOutputPeriodTypes, getPeriodTypeOptions }
