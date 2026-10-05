import { createFakeOrgUnitServer } from '../../../__fixtures__/fakeOrgUnitServer.js'
import {
    fetchGroupMembersByLevel,
    getGroupCountQueries,
} from '../orgUnitGroupCounts.js'

/* A nation (1) with a district (2) holding two facilities (3). The group's
 * members: the district and one facility. formMonth: the facilities. */
const ORG_UNITS = [
    ['nationUnit1', 1, '/nationUnit1', []],
    ['districtAAA', 2, '/nationUnit1/districtAAA', []],
    ['facilityAAA', 3, '/nationUnit1/districtAAA/facilityAAA', ['formMonth']],
    ['facilityBBB', 3, '/nationUnit1/districtAAA/facilityBBB', ['formMonth']],
].map(([id, level, path, dataSets]) => ({
    id,
    level,
    path,
    dataSets,
    programs: [],
}))
const GROUPS = { groupAAAAAA: ['districtAAA', 'facilityAAA'], emptyGroupA: [] }
const LEVELS = [1, 2, 3].map((level) => ({ id: `level${level}`, level }))
const FORM_MONTH = { id: 'formMonth', field: 'dataSets' }

const filtersOf = (queries) =>
    Object.fromEntries(
        queries.map(([key, query]) => [key.join('|'), query.params.filter])
    )

describe('fetchGroupMembersByLevel', () => {
    it('counts each group’s members per level, leaving out empty levels', async () => {
        const { createEngine } = createFakeOrgUnitServer({
            orgUnits: ORG_UNITS,
            groups: GROUPS,
        })

        expect(
            await fetchGroupMembersByLevel(createEngine(), {
                groupIds: ['groupAAAAAA', 'emptyGroupA'],
                levels: LEVELS,
            })
        ).toEqual({
            groups: { groupAAAAAA: { 2: 1, 3: 1 }, emptyGroupA: {} },
            requests: 6,
        })
    })
})

describe('getGroupCountQueries', () => {
    const orgUnitsById = Object.fromEntries(
        ORG_UNITS.map((orgUnit) => [orgUnit.id, orgUnit])
    )
    const queriesFor = (parentIds) =>
        getGroupCountQueries({
            groups: { groupAAAAAA: { 2: 1 } },
            parents:
                parentIds?.map((id) => ({
                    orgUnitId: id,
                    minLevel: orgUnitsById[id].level,
                })) ?? null,
            orgUnits: orgUnitsById,
            sourceKeys: [FORM_MONTH],
            assignedOrgUnitCounts: { formMonth: { 1: 1, 3: 2 } },
        })

    it('counts org units below the members, and the sources above them', () => {
        expect(filtersOf(queriesFor())).toEqual({
            'groupAAAAAA:2:|total|2': [
                'organisationUnitGroups.id:eq:groupAAAAAA',
                'level:eq:2',
            ],
            'groupAAAAAA:2:|total|3': [
                'parent.organisationUnitGroups.id:eq:groupAAAAAA',
                'level:eq:3',
            ],
            'groupAAAAAA:2:|formMonth|ancestors': [
                'children.organisationUnitGroups.id:eq:groupAAAAAA',
                'level:eq:1',
                'dataSets.id:eq:formMonth',
            ],
            'groupAAAAAA:2:|formMonth|3': [
                'parent.organisationUnitGroups.id:eq:groupAAAAAA',
                'level:eq:3',
                'dataSets.id:eq:formMonth',
            ],
        })
    })

    it('keeps the members, and the org units above them, under each parent at or above them', () => {
        const filters = filtersOf(queriesFor(['nationUnit1', 'facilityAAA']))

        expect(filters['groupAAAAAA:2:nationUnit1|total|2']).toEqual([
            'path:like:nationUnit1',
            'organisationUnitGroups.id:eq:groupAAAAAA',
            'level:eq:2',
        ])
        expect(
            filters['groupAAAAAA:2:nationUnit1|formMonth|ancestors']
        ).toEqual([
            'path:like:nationUnit1',
            'children.organisationUnitGroups.id:eq:groupAAAAAA',
            'level:eq:1',
            'dataSets.id:eq:formMonth',
        ])
        expect(
            Object.keys(filters).some((key) => key.includes('facilityAAA'))
        ).toBe(false)
    })

    it('takes the ancestors above a parent from its path', () => {
        const filters = filtersOf(queriesFor(['districtAAA']))

        expect(
            filters['groupAAAAAA:2:districtAAA|formMonth|ancestors']
        ).toEqual([
            'id:in:[nationUnit1]',
            'level:eq:1',
            'dataSets.id:eq:formMonth',
        ])
    })
})
