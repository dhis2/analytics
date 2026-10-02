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
    const byId = Object.fromEntries(orgUnits.map((unit) => [unit.id, unit]))
    const parentOf = ({ path }) => byId[path.split('/').at(-2)]
    const childrenOf = (unit) =>
        orgUnits.filter((other) => parentOf(other) === unit)

    // organisationUnitGroups.id, behind parent. and children. steps
    const isInGroup = (unit, field, groupId) => {
        const steps = field.split('.').slice(0, -2)
        const related = steps.reduce(
            (units, step) =>
                units.flatMap((one) =>
                    step === 'parent'
                        ? [parentOf(one)].filter(Boolean)
                        : childrenOf(one)
                ),
            [unit]
        )

        return related.some(({ id }) => groups[groupId]?.includes(id))
    }

    const isAssigned = (unit, field, id) =>
        unit[field.split('.')[0]].includes(id)

    const FILTERS = {
        in: (unit, field, value) =>
            value.slice(1, -1).split(',').includes(unit[field]),
        eq: (unit, field, value) => {
            if (field.endsWith('organisationUnitGroups.id')) {
                return isInGroup(unit, field, value)
            }

            return ['dataSets.id', 'programs.id'].includes(field)
                ? isAssigned(unit, field, value)
                : String(unit[field]) === value
        },
        like: (unit, field, value) => unit[field].includes(value),
    }

    const applyFilters = (filter) =>
        [filter].flat().reduce((units, condition) => {
            const [field, operator, ...rest] = condition.split(':')

            return units.filter((unit) =>
                FILTERS[operator](unit, field, rest.join(':'))
            )
        }, orgUnits)

    const toUnits = (ids = []) => ids.map((id) => byId[id])

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
                organisationUnits: toUnits(user.organisationUnits),
                dataViewOrganisationUnits: toUnits(
                    user.dataViewOrganisationUnits
                ),
            }
        }

        const units = applyFilters(params.filter)

        return params.pageSize === 1
            ? {
                  pager: { total: units.length },
                  organisationUnits: units.slice(0, 1),
              }
            : { organisationUnits: units }
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
