import { useConfig } from '@dhis2/app-runtime'
import { useV43DataOutputPeriodTypes } from './versions/v43.js'
import { useV44DataOutputPeriodTypes } from './versions/v44.js'

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

export { useDataOutputPeriodTypes }
