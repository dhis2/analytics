/* A fake server for the org unit requests of the data item profile:
 * organisationUnits (with the filters the library sends), organisationUnitLevels
 * and me. `orgUnits` are [{ id, level, path, dataSets, programs }] (ids of
 * what each is assigned to), `groups` are { [groupId]: [orgUnitId] }, `user`
 * is { organisationUnits, dataViewOrganisationUnits } (org unit ids), and
 * `levels` the order levels are listed in (as found by default). */
export const createFakeOrgUnitServer = ({
    orgUnits,
    groups = {},
    user = {},
    levels = [...new Set(orgUnits.map(({ level }) => level))],
}) => {
    const byId = Object.fromEntries(
        orgUnits.map((orgUnit) => [orgUnit.id, orgUnit])
    )
    const parentOf = ({ path }) => byId[path.split('/').at(-2)]
    const childrenOf = (orgUnit) =>
        orgUnits.filter((other) => parentOf(other) === orgUnit)

    // organisationUnitGroups.id, behind parent. and children. steps
    const isInGroup = (orgUnit, field, groupId) => {
        const steps = field.split('.').slice(0, -2)
        const related = steps.reduce(
            (matching, step) =>
                matching.flatMap((one) =>
                    step === 'parent'
                        ? [parentOf(one)].filter(Boolean)
                        : childrenOf(one)
                ),
            [orgUnit]
        )

        return related.some(({ id }) => groups[groupId]?.includes(id))
    }

    const isAssigned = (orgUnit, field, id) =>
        orgUnit[field.split('.')[0]].includes(id)

    const FILTERS = {
        in: (orgUnit, field, value) =>
            value.slice(1, -1).split(',').includes(orgUnit[field]),
        eq: (orgUnit, field, value) => {
            if (field.endsWith('organisationUnitGroups.id')) {
                return isInGroup(orgUnit, field, value)
            }

            return ['dataSets.id', 'programs.id'].includes(field)
                ? isAssigned(orgUnit, field, value)
                : String(orgUnit[field]) === value
        },
        like: (orgUnit, field, value) => orgUnit[field].includes(value),
    }

    const applyFilters = (filter) =>
        [filter].flat().reduce((matching, condition) => {
            const [field, operator, ...rest] = condition.split(':')

            return matching.filter((orgUnit) =>
                FILTERS[operator](orgUnit, field, rest.join(':'))
            )
        }, orgUnits)

    const toOrgUnits = (ids = []) => ids.map((id) => byId[id])

    const answer = ({ resource, params }) => {
        if (resource === 'organisationUnitLevels') {
            return {
                organisationUnitLevels: levels.map((level) => ({
                    id: `level${level}`,
                    level,
                    displayName: `Level ${level}`,
                })),
            }
        }

        if (resource === 'me') {
            return {
                organisationUnits: toOrgUnits(user.organisationUnits),
                dataViewOrganisationUnits: toOrgUnits(
                    user.dataViewOrganisationUnits
                ),
            }
        }

        const matching = applyFilters(params.filter)

        return params.pageSize === 1
            ? {
                  pager: { total: matching.length },
                  organisationUnits: matching.slice(0, 1),
              }
            : { organisationUnits: matching }
    }

    const createEngine = () => ({
        query: jest.fn(async (query) =>
            Object.fromEntries(
                Object.entries(query).map(([key, request]) => [
                    key,
                    answer(request),
                ])
            )
        ),
    })

    return { answer, createEngine }
}
