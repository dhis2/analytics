import { combineResults } from './compatibility/combineResults.js'
import { getDataItemProfileOrgUnitCompatibility } from './compatibility/getDataItemProfileOrgUnitCompatibility.js'
import { getDataItemProfilePeriodCompatibility } from './compatibility/getDataItemProfilePeriodCompatibility.js'
import { getSourceId } from './sources.js'

const NO_RESULT = { status: null, reasons: [] }

/**
 * Whether a selection suits a data item, from its profile (getDataItemProfile):
 * whether analytics will return all of the item's values for these periods
 * and org units.
 *
 * The status is `full`, `partial`, `none` or `unknown`: compatible with all,
 * some or none of the item's data sets and programs that collect for the
 * selection. `reasons` say why, and on a full result whether values are
 * repeated or taken from an earlier period rather than added up for it.
 *
 * - `periods`: getDataItemProfilePeriodCompatibility, one result per period.
 * - `orgUnits` (DV's org unit items): getDataItemProfileOrgUnitCompatibility,
 *   one result per selection item, from `options.orgUnitCoverage`
 *   (fetchOrgUnitCoverage). Given only when org units are asked.
 * - `sources`: each source over the periods (aligned with `profile.sources`).
 * - Overall: the most severe status, with every reason.
 *
 * Periods and org units are judged apart: a data set assigned to some org
 * units only, at another period type than the others, isn't judged per org
 * unit.
 * `options` are passed to the period check (relative period settings,
 * calendar, server version).
 */
export const getDataItemProfileCompatibility = (
    profile,
    { periods = [], orgUnits = [] } = {},
    { orgUnitCoverage, ...options } = {}
) => {
    const periodResults = getDataItemProfilePeriodCompatibility(profile, {
        periods,
        ...options,
    })
    const orgUnitResults = orgUnits.length
        ? getDataItemProfileOrgUnitCompatibility(profile, {
              orgUnits,
              coverage: orgUnitCoverage,
          })
        : []
    const all = [...periodResults, ...orgUnitResults]

    return {
        ...(all.length ? combineResults(all) : NO_RESULT),
        sources: profile.sources.map((source, i) => ({
            sourceId: getSourceId(source),
            ...(periodResults.length
                ? combineResults(periodResults.map(({ sources }) => sources[i]))
                : NO_RESULT),
        })),
        periods: periodResults,
        ...(orgUnits.length && { orgUnits: orgUnitResults }),
    }
}
