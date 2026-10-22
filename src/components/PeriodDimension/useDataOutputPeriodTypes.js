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

    // enabledPeriodTypesData stays null on v42 and when the request fails,
    // loading tells consumers whether to wait for it
    const { enabledPeriodTypesData, loading } = supportsPeriodLabelTranslations
        ? v44
        : v43

    return {
        supportsEnabledPeriodTypes,
        enabledPeriodTypesData,
        loading,
    }
}

export { useDataOutputPeriodTypes }
