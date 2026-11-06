import { useConfig } from '@dhis2/app-runtime'
import { useV43DataOutputPeriodTypes } from './versions/v43.js'
import { useV44DataOutputPeriodTypes } from './versions/v44.js'

const useDataOutputPeriodTypes = () => {
    const { serverVersion } = useConfig()
    const supportsEnabledPeriodTypes = serverVersion.minor >= 43
    const supportsPeriodLabelTranslations = serverVersion.minor >= 44

    const v43 = useV43DataOutputPeriodTypes({
        enabled: supportsEnabledPeriodTypes && !supportsPeriodLabelTranslations,
    })
    const v44 = useV44DataOutputPeriodTypes({
        enabled: supportsPeriodLabelTranslations,
    })

    // enabledPeriodTypesData is null on v42, while loading and when the request
    // fails. Consumers should wait while loading and handle the error instead of
    // falling back to the hardcoded client lists, as those would show period
    // types that are disabled on the server.
    const { enabledPeriodTypesData, loading, error } =
        supportsPeriodLabelTranslations ? v44 : v43

    return {
        supportsEnabledPeriodTypes,
        enabledPeriodTypesData,
        loading,
        error,
    }
}

export { useDataOutputPeriodTypes }
