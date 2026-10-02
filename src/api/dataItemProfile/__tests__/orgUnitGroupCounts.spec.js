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
            await fetchGroupMembersByLevel(
                createEngine(),
                ['groupAAAAAA', 'emptyGroupA'],
                LEVELS
            )
        ).toEqual({
            groups: { groupAAAAAA: { 2: 1, 3: 1 }, emptyGroupA: {} },
            requests: 6,
        })
    })
})

describe('getGroupCountQueries', () => {
    const queriesFor = (parentOrgUnitIds = []) =>
        getGroupCountQueries({
            groups: { groupAAAAAA: { 2: 1 } },
            parentOrgUnitIds,
            orgUnits: Object.fromEntries(
                ORG_UNITS.map((unit) => [unit.id, unit])
            ),
            sources: [FORM_MONTH],
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

    it('keeps the members under each parent at or above them', () => {
        const filters = filtersOf(queriesFor(['nationUnit1', 'facilityAAA']))

        expect(filters['groupAAAAAA:2:nationUnit1|total|2']).toEqual([
            'path:like:nationUnit1',
            'organisationUnitGroups.id:eq:groupAAAAAA',
            'level:eq:2',
        ])
        expect(
            Object.keys(filters).some((key) => key.includes('facilityAAA'))
        ).toBe(false)
    })
})
