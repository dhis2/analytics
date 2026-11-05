import { createFakeOrgUnitServer } from '../../../__fixtures__/fakeOrgUnitServer.js'
import { createListCounter } from '../orgUnitListCounts.js'

/* A nation with 2 districts and 3 facilities; formMonth: the nation and 2
 * facilities. The counter must agree with the server on every filter. */
const UNITS = [
    ['nationUnit1', 1, '/nationUnit1', ['formMonth']],
    ['districtAAA', 2, '/nationUnit1/districtAAA', []],
    ['districtBBB', 2, '/nationUnit1/districtBBB', []],
    ['facilityAAA', 3, '/nationUnit1/districtAAA/facilityAAA', ['formMonth']],
    ['facilityBBB', 3, '/nationUnit1/districtAAA/facilityBBB', ['formMonth']],
    ['facilityCCC', 3, '/nationUnit1/districtBBB/facilityCCC', []],
].map(([id, level, path, dataSets]) => ({
    id,
    level,
    path,
    dataSets,
    programs: [],
}))
const GROUPS = {
    clinicGroup: ['facilityAAA', 'facilityCCC'],
    mixedGroupA: ['districtBBB', 'facilityAAA'],
}

const { answer } = createFakeOrgUnitServer({ orgUnits: UNITS, groups: GROUPS })

const listOf = (filter) =>
    answer({
        resource: 'organisationUnits',
        params: { filter },
    }).organisationUnits.map(({ path }) => path)

const ASSIGNED = 'dataSets.id:eq:formMonth'

describe('createListCounter', () => {
    const count = createListCounter(
        Object.fromEntries(
            Object.keys(GROUPS).map((groupId) => [
                groupId,
                listOf(`organisationUnitGroups.id:eq:${groupId}`),
            ])
        )
    )

    it.each([
        [['level:eq:3']],
        [['path:like:districtAAA', 'level:eq:3']],
        [['id:in:[nationUnit1,districtAAA]']],
        [['organisationUnitGroups.id:eq:clinicGroup', 'level:eq:3']],
        [['parent.organisationUnitGroups.id:eq:mixedGroupA', 'level:eq:3']],
        [['children.organisationUnitGroups.id:eq:clinicGroup', 'level:eq:2']],
        [
            [
                'children.children.organisationUnitGroups.id:eq:mixedGroupA',
                'level:eq:1',
            ],
        ],
        [
            [
                'path:like:nationUnit1',
                'parent.parent.organisationUnitGroups.id:eq:mixedGroupA',
            ],
        ],
    ])('counts %j as the server does', (filter) => {
        expect(count(listOf(ASSIGNED), filter)).toBe(
            listOf([...filter, ASSIGNED]).length
        )
    })

    it('counts nothing for a filter it cannot evaluate', () => {
        expect(count(listOf(ASSIGNED), ['name:eq:Nation'])).toBe(0)
    })
})
