// v42: no enabled period types API, all period types and relative periods
// come from the hardcoded client lists.
// Remove this file (and its branch in periodTypeOptions.js) when v42 is no longer supported.
import { getFixedPeriodsOptions } from '../utils/fixedPeriods.js'
import {
    FYAUG,
    FYFEB,
    FYSEP,
    WEEKLYFRI,
    filterPeriodTypesById,
} from '../utils/index.js'
import { getRelativePeriodsOptions } from '../utils/relativePeriods.js'

// period types that were introduced in v43
const V43_PERIOD_TYPES = [WEEKLYFRI, FYFEB, FYAUG, FYSEP]

export const getV42PeriodTypeOptions = ({
    periodsSettings,
    excludedPeriodTypes,
}) => {
    const allExcludedPeriodTypes = [...excludedPeriodTypes, ...V43_PERIOD_TYPES]

    return {
        fixedOptions: filterPeriodTypesById(
            getFixedPeriodsOptions(periodsSettings),
            allExcludedPeriodTypes
        ),
        relativeOptions: filterPeriodTypesById(
            getRelativePeriodsOptions(),
            allExcludedPeriodTypes
        ),
    }
}
