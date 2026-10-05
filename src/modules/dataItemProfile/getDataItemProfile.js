import { addAssignedOrgUnitLevels } from './profile/assignedOrgUnitLevels.js'
import { getAssignedPeriodTypes } from './profile/assignedPeriodTypes.js'
import { collectSources } from './profile/collectSources.js'

/**
 * The profile of a data item ({ id, dimensionItemType }), from its metadata
 * (fetchDataItemProfileMetadata): where its data comes from.
 *
 * - `sources`: one per data set it is assigned to, with the item's elements
 *   in it (a reporting rate is its data set), and one per program.
 * - `expression`, for an indicator or expression dimension item: how its
 *   operands combine, `{ missingValueStrategy, parts }`, each part an
 *   `{ operand }` (a key of getItemOperands) or an expression. An indicator
 *   needs both sides (SKIP_IF_ANY_VALUE_MISSING); each side has a value
 *   when one of its operands has (SKIP_IF_ALL_VALUES_MISSING).
 * - `assignedPeriodTypes`: the period types of those data sets
 *   (getAssignedPeriodTypes).
 * - `assignedOrgUnitLevels`: the org unit levels its data sets and programs
 *   are assigned at (getAssignedOrgUnitLevels), when the metadata has the
 *   counts (`assignedOrgUnitCounts`, fetched by default).
 * - `unknown` and `reasons`: missing metadata makes the item unknown; it is
 *   never guessed.
 */
export const getDataItemProfile = (item, metadata = {}) => {
    const { sources, reasons, expression } = collectSources(item, metadata)
    const profile = {
        sources,
        ...(expression && { expression }),
        unknown: reasons.length > 0,
        reasons,
        assignedPeriodTypes: getAssignedPeriodTypes(sources),
    }

    return metadata.assignedOrgUnitCounts
        ? addAssignedOrgUnitLevels(profile, metadata.assignedOrgUnitCounts)
        : profile
}
