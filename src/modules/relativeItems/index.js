import { getRelativePeriodIds } from '../../components/PeriodDimension/utils/relativePeriods'
import { ouIdHelper } from '../ouIdHelper'
import {
    DIMENSION_ID_ASSIGNED_CATEGORIES,
    DIMENSION_ID_ORGUNIT,
    DIMENSION_ID_PERIOD,
} from '../predefinedDimensions'

export const hasRelativeItems = (dimension, itemIds = []) =>
    dimension === DIMENSION_ID_ASSIGNED_CATEGORIES ||
    (dimension === DIMENSION_ID_ORGUNIT &&
        Array.isArray(itemIds) &&
        itemIds.some(
            id =>
                ouIdHelper.hasLevelPrefix(id) ||
                ouIdHelper.hasGroupPrefix(id) ||
                [
                    'USER_ORGUNIT',
                    'USER_ORGUNIT_CHILDREN',
                    'USER_ORGUNIT_GRAND_CHILDREN',
                ].includes(id)
        )) ||
    (dimension === DIMENSION_ID_PERIOD &&
        Array.isArray(itemIds) &&
        itemIds.some(id => getRelativePeriodIds().includes(id)))
