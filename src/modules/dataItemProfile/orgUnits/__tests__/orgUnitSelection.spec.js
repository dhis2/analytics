import {
    getRequestedLevels,
    getOrgUnitsToFetch,
    parseOrgUnitSelectionItem,
    readOrgUnitSelection,
} from '../orgUnitSelection.js'

describe('parseOrgUnitSelectionItem', () => {
    it.each([
        ['ImspTQPwCqd', { type: 'ORG_UNIT' }],
        ['LEVEL-2', { type: 'LEVEL', level: 2 }],
        ['LEVEL-wjP19dkFeIk', { type: 'LEVEL', level: 'wjP19dkFeIk' }],
        ['OU_GROUP-RXL3lPSK8oG', { type: 'GROUP', groupId: 'RXL3lPSK8oG' }],
        ['USER_ORGUNIT', { type: 'USER', depth: 0 }],
        ['USER_ORGUNIT_CHILDREN', { type: 'USER', depth: 1 }],
        ['USER_ORGUNIT_GRANDCHILDREN', { type: 'USER', depth: 2 }],
        ['not an id', { type: 'UNKNOWN' }],
        ['toString', { type: 'UNKNOWN' }],
    ])('reads %s', (id, expected) => {
        expect(parseOrgUnitSelectionItem(id)).toEqual({ id, ...expected })
    })
})

describe('readOrgUnitSelection', () => {
    it('judges org units on their own', () => {
        expect(readOrgUnitSelection(['unitAAAAAAA', 'unitBBBBBBB'])).toEqual({
            selectionItems: [
                { id: 'unitAAAAAAA', type: 'ORG_UNIT' },
                { id: 'unitBBBBBBB', type: 'ORG_UNIT' },
            ],
            parentItems: [],
        })
    })

    it('takes the org units and the user org units as parents of a level or a group', () => {
        expect(
            readOrgUnitSelection(['unitAAAAAAA', 'LEVEL-3', 'USER_ORGUNIT'])
        ).toEqual({
            selectionItems: [{ id: 'LEVEL-3', type: 'LEVEL', level: 3 }],
            parentItems: [
                { id: 'unitAAAAAAA', type: 'ORG_UNIT' },
                { id: 'USER_ORGUNIT', type: 'USER', depth: 0 },
            ],
        })
    })

    it('reads nothing from no selection', () => {
        expect(readOrgUnitSelection()).toEqual({
            selectionItems: [],
            parentItems: [],
        })
    })
})

describe('getOrgUnitsToFetch', () => {
    it('fetches the org units of a selection', () => {
        expect(getOrgUnitsToFetch(['unitAAAAAAA', 'LEVEL-2'])).toEqual({
            orgUnitIds: ['unitAAAAAAA'],
            needsRoots: false,
            needsUserOrgUnits: false,
            groupIds: [],
        })
    })

    it('fetches the roots for a level alone, and the user org units', () => {
        expect(getOrgUnitsToFetch(['LEVEL-2'])).toMatchObject({
            needsRoots: true,
            needsUserOrgUnits: false,
        })
        expect(
            getOrgUnitsToFetch(['LEVEL-2', 'USER_ORGUNIT_CHILDREN'])
        ).toEqual({
            orgUnitIds: [],
            needsRoots: false,
            needsUserOrgUnits: true,
            groupIds: [],
        })
        expect(getOrgUnitsToFetch()).toEqual({
            orgUnitIds: [],
            needsRoots: false,
            needsUserOrgUnits: false,
            groupIds: [],
        })
    })

    it('lists the groups once each, with no roots for them', () => {
        expect(
            getOrgUnitsToFetch(['OU_GROUP-groupAAAAAA', 'OU_GROUP-groupAAAAAA'])
        ).toEqual({
            orgUnitIds: [],
            needsRoots: false,
            needsUserOrgUnits: false,
            groupIds: ['groupAAAAAA'],
        })
    })
})

describe('getRequestedLevels', () => {
    const COVERAGE = {
        levels: [
            { id: 'levelNation', level: 1 },
            { id: 'levelDistri', level: 2 },
            { id: 'levelChiefd', level: 3 },
            { id: 'levelFacili', level: 4 },
        ],
        orgUnits: {
            nationUnit1: { id: 'nationUnit1', level: 1, path: '/nationUnit1' },
            districtAAA: {
                id: 'districtAAA',
                level: 2,
                path: '/nationUnit1/districtAAA',
            },
            facilityAAA: {
                id: 'facilityAAA',
                level: 4,
                path: '/nationUnit1/districtAAA/chiefdomAAA/facilityAAA',
            },
        },
        rootIds: ['nationUnit1'],
        userOrgUnitIds: ['districtAAA'],
        groups: { groupAAAAAA: { 2: 3, 3: 0, 4: 5 } },
    }
    const targets = (id, parents = [], coverage = COVERAGE) =>
        getRequestedLevels(
            parseOrgUnitSelectionItem(id),
            parents.map(parseOrgUnitSelectionItem),
            coverage
        )

    it('asks an org unit at its own level', () => {
        expect(targets('districtAAA')).toEqual([
            { countsKey: 'districtAAA', level: 2 },
        ])
    })

    it('asks a level under each parent that holds it', () => {
        expect(targets('LEVEL-3', ['nationUnit1', 'facilityAAA'])).toEqual([
            { countsKey: 'nationUnit1', level: 3 },
        ])
    })

    it('asks a level once under a parent given twice, or within another', () => {
        expect(
            targets('LEVEL-4', ['districtAAA', 'districtAAA', 'facilityAAA'])
        ).toEqual([{ countsKey: 'districtAAA', level: 4 }])
        expect(
            targets('LEVEL-4', ['USER_ORGUNIT', 'USER_ORGUNIT_CHILDREN'])
        ).toEqual([{ countsKey: 'districtAAA', level: 4 }])
    })

    it('keeps a parent within another that holds fewer levels', () => {
        expect(
            targets('LEVEL-3', ['USER_ORGUNIT_GRANDCHILDREN', 'districtAAA'])
        ).toEqual([{ countsKey: 'districtAAA', level: 3 }])
    })

    it('asks a level under the user org units, below the depth of the user item', () => {
        expect(targets('LEVEL-3', ['USER_ORGUNIT_CHILDREN'])).toEqual([
            { countsKey: 'districtAAA', level: 3 },
        ])
        expect(targets('LEVEL-2', ['USER_ORGUNIT_CHILDREN'])).toEqual([])
    })

    it('asks nothing for a level deeper than the hierarchy', () => {
        expect(targets('LEVEL-7', ['nationUnit1'])).toEqual([])
    })

    it('asks a level under the roots without parents, by number or id', () => {
        expect(targets('LEVEL-levelDistri')).toEqual([
            { countsKey: 'nationUnit1', level: 2 },
        ])
    })

    it('asks the user org units at their level plus the depth', () => {
        expect(targets('USER_ORGUNIT_GRANDCHILDREN')).toEqual([
            { countsKey: 'districtAAA', level: 4 },
        ])
    })

    it('asks a group at each level its members are at', () => {
        expect(targets('OU_GROUP-groupAAAAAA')).toEqual([
            { countsKey: 'groupAAAAAA:2:', level: 2, groupId: 'groupAAAAAA' },
            { countsKey: 'groupAAAAAA:4:', level: 4, groupId: 'groupAAAAAA' },
        ])
    })

    it('asks a group under each parent at or above its members, inside no other', () => {
        expect(
            targets('OU_GROUP-groupAAAAAA', ['districtAAA', 'facilityAAA'])
        ).toEqual([
            {
                countsKey: 'groupAAAAAA:2:districtAAA',
                level: 2,
                groupId: 'groupAAAAAA',
            },
            {
                countsKey: 'groupAAAAAA:4:districtAAA',
                level: 4,
                groupId: 'groupAAAAAA',
            },
        ])
        expect(targets('OU_GROUP-groupAAAAAA', ['facilityAAA'])).toEqual([
            {
                countsKey: 'groupAAAAAA:4:facilityAAA',
                level: 4,
                groupId: 'groupAAAAAA',
            },
        ])
    })

    it('cannot tell for a group, an unknown level, or org units not loaded', () => {
        expect(targets('OU_GROUP-notLoadedGr')).toBeNull()
        expect(targets('OU_GROUP-groupAAAAAA', ['notLoadedUn'])).toBeNull()
        expect(targets('LEVEL-unknownLvl')).toBeNull()
        expect(targets('LEVEL-3', ['notLoadedUn'])).toBeNull()
        expect(
            targets('USER_ORGUNIT', [], { ...COVERAGE, userOrgUnitIds: null })
        ).toBeNull()
        expect(
            targets('USER_ORGUNIT', [], {
                ...COVERAGE,
                userOrgUnitIds: ['other'],
            })
        ).toBeNull()
    })
})
