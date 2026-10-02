import { canBeAtAnyOrgUnit, getSourceId } from '../sources.js'

const getLevelsWithUnits = (countsByLevel = {}) =>
    Object.keys(countsByLevel)
        .map(Number)
        .filter((level) => countsByLevel[level] > 0)

/**
 * The org unit levels an item's data sets and programs are assigned at,
 * deepest first, from each source's `assignedOrgUnitCounts`; the deepest
 * (`deepestLevel`); and whether sources have different deepest levels
 * (`hasSeveral`).
 */
export const getAssignedOrgUnitLevels = (sources) => {
    const levelsBySource = sources
        .filter(({ assignedOrgUnitCounts }) => assignedOrgUnitCounts)
        .map(({ assignedOrgUnitCounts }) =>
            getLevelsWithUnits(assignedOrgUnitCounts)
        )
    const levels = [...new Set(levelsBySource.flat())].sort((a, b) => b - a)
    const deepestOfEach = levelsBySource
        .filter((sourceLevels) => sourceLevels.length)
        .map((sourceLevels) => Math.max(...sourceLevels))

    return {
        levels,
        deepestLevel: levels[0] ?? null,
        hasSeveral: new Set(deepestOfEach).size > 1,
    }
}

/**
 * The profile with its assigned org unit levels, from the number of org units
 * each data set or program is assigned to per level (`{ [sourceId]:
 * { [level]: count } }`, as fetchAssignedOrgUnitCounts gives them): each
 * source gains its `assignedOrgUnitCounts`, except program indicators whose
 * values can be at any org unit.
 */
export const addAssignedOrgUnitLevels = (profile, assignedOrgUnitCounts) => {
    const sources = profile.sources.map((source) =>
        getSourceId(source) && !canBeAtAnyOrgUnit(source)
            ? {
                  ...source,
                  assignedOrgUnitCounts:
                      assignedOrgUnitCounts[getSourceId(source)] ?? {},
              }
            : source
    )

    return {
        ...profile,
        sources,
        assignedOrgUnitLevels: getAssignedOrgUnitLevels(sources),
    }
}
