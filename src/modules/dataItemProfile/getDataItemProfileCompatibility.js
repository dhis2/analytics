import { combineAddedUpResults } from './compatibility/combineResults.js'
import { getDataItemProfileOrgUnitCompatibility } from './compatibility/getDataItemProfileOrgUnitCompatibility.js'
import { getDataItemProfilePeriodCompatibility } from './compatibility/getDataItemProfilePeriodCompatibility.js'
import { getPeriodAtOrgUnitResults } from './compatibility/periodAtOrgUnitResults.js'
import { getSourceId } from './sources.js'

const NO_RESULT = { status: null, reasons: [] }

/**
 * Whether a selection suits a data item, from its profile (getDataItemProfile):
 * whether analytics will return all of the item's values for these periods
 * and org units.
 *
 * The status is `full`, `partial`, `none` or `unknown`: compatible with all,
 * some or none of the item's data sets and programs that apply to the
 * selection. `reasons` say why, and on a full result whether values are
 * repeated or taken from an earlier period rather than added up for it.
 *
 * - `periods`: getDataItemProfilePeriodCompatibility, one result per period.
 * - `orgUnits` (DV's org unit items): getDataItemProfileOrgUnitCompatibility,
 *   one result per selection item, from `options.orgUnitCoverage`
 *   (fetchOrgUnitCoverage). Given only when org units are asked.
 * - `sources`: each source over the periods (aligned with `profile.sources`).
 * - Overall: with periods and org units, each period at each org unit
 *   (getPeriodAtOrgUnitResults), where only the data sets and programs
 *   assigned there count; with one of them alone, its results. They add up,
 *   as the fixed periods of a relative period do: none when all are none,
 *   partial when some give values and others none, with every reason.
 *
 * `periods` and `orgUnits` are each judged alone, for pickers: by week, an
 * element in a monthly data set at district A and a weekly one at B is
 * partial (the monthly values are left out), and at A it is full (the
 * weekly data set isn't assigned there). Only the overall result sees that
 * by week at A it has nothing.
 * `options` are passed to the period check (relative period settings,
 * relativePeriodDate, calendar, server version).
 */
export const getDataItemProfileCompatibility = (
    profile,
    { periods = [], orgUnits = [] } = {},
    { orgUnitCoverage, ...options } = {}
) => {
    const periodResults = getDataItemProfilePeriodCompatibility(
        profile,
        { periods },
        options
    )
    const orgUnitResults = orgUnits.length
        ? getDataItemProfileOrgUnitCompatibility(
              profile,
              { orgUnits },
              { orgUnitCoverage }
          )
        : []
    const periodAtOrgUnitResults =
        periods.length && orgUnits.length
            ? getPeriodAtOrgUnitResults(
                  profile,
                  { periods, orgUnits },
                  { orgUnitCoverage, ...options }
              )
            : []
    const overall = periodAtOrgUnitResults.length
        ? periodAtOrgUnitResults
        : [...periodResults, ...orgUnitResults]

    return {
        ...(overall.length ? combineAddedUpResults(overall) : NO_RESULT),
        sources: profile.sources.map((source, i) => ({
            sourceId: getSourceId(source),
            ...(periodResults.length
                ? combineAddedUpResults(
                      periodResults.map(({ sources }) => sources[i])
                  )
                : NO_RESULT),
        })),
        periods: periodResults,
        ...(orgUnits.length && { orgUnits: orgUnitResults }),
    }
}
