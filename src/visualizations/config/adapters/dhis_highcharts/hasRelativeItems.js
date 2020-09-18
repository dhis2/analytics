import { getRelativePeriodIds } from "../../../../components/PeriodDimension/utils/relativePeriods";
import { ouIdHelper } from "../../../../modules/ouIdHelper";
import { DIMENSION_ID_ASSIGNED_CATEGORIES, DIMENSION_ID_ORGUNIT, DIMENSION_ID_PERIOD } from "../../../../modules/predefinedDimensions";

export const hasRelativeItems = (dimension, items) => 
    dimension === DIMENSION_ID_ASSIGNED_CATEGORIES || 
    (
        dimension === DIMENSION_ID_ORGUNIT &&
        items.some(
            item =>
                ouIdHelper.hasLevelPrefix(item.id) ||
                ouIdHelper.hasGroupPrefix(item.id) ||
                item.id.startsWith('USER_ORGUNIT')
        )
    ) || 
    (
        dimension === DIMENSION_ID_PERIOD &&
        items.some(item =>
            getRelativePeriodIds().includes(item.id)
        )
    )