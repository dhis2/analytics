import { getRelativePeriodIds } from "../../../../components/PeriodDimension/utils/relativePeriods";
import { ouIdHelper } from "../../../../modules/ouIdHelper";
import { DIMENSION_ID_ASSIGNED_CATEGORIES, DIMENSION_ID_ORGUNIT, DIMENSION_ID_PERIOD } from "../../../../modules/predefinedDimensions";

export const hasRelativeItems = (dimension, itemIds) => 
    dimension === DIMENSION_ID_ASSIGNED_CATEGORIES || 
    (
        dimension === DIMENSION_ID_ORGUNIT &&
        itemIds.some(
            id =>
                ouIdHelper.hasLevelPrefix(id) ||
                ouIdHelper.hasGroupPrefix(id) ||
                id.startsWith('USER_ORGUNIT')
        )
    ) || 
    (
        dimension === DIMENSION_ID_PERIOD &&
        itemIds.some(id =>
            getRelativePeriodIds().includes(id)
        )
    )