import { useMemo } from 'react'
import { useDataOutputPeriodTypes } from './useDataOutputPeriodTypes.js'
import { getRelativePeriodsName } from './utils/relativePeriods.js'

// Relative period id -> name map, for apps that need to show relative period
// names outside of the PeriodDimension (i.e. to populate their metadata).
// The names are the same used by the PeriodDimension:
// - v42: the hardcoded client names
// - v43: the hardcoded client names with the names derived from the server
//   period type labels (financial years and weeks)
// - v44: the server names (label translation -> label -> default name)
// The hardcoded client names are always used as fallback, for relative periods
// not returned by the server (i.e. of disabled period types), while loading and
// when the request fails, so the ids are never shown as names.
const useRelativePeriodsNames = () => {
    const { enabledPeriodTypesData, loading, error } =
        useDataOutputPeriodTypes()

    const relativePeriodsNames = useMemo(() => {
        const names = getRelativePeriodsName()

        Object.entries(enabledPeriodTypesData?.metaData || {}).forEach(
            ([id, { name }]) => {
                if (name) {
                    names[id] = name
                }
            }
        )

        return names
    }, [enabledPeriodTypesData])

    return { relativePeriodsNames, loading, error }
}

export { useRelativePeriodsNames }
