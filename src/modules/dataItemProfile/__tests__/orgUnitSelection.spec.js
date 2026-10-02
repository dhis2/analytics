import {
    getOrgUnitTargets,
    getUnitsToCount,
    parseOrgUnitItem,
    readOrgUnitSelection,
} from '../orgUnitSelection.js'

describe('parseOrgUnitItem', () => {
    it.each([
        ['ImspTQPwCqd', { kind: 'UNIT' }],
        ['LEVEL-2', { kind: 'LEVEL', level: 2 }],
        ['LEVEL-wjP19dkFeIk', { kind: 'LEVEL', level: 'wjP19dkFeIk' }],
        ['OU_GROUP-RXL3lPSK8oG', { kind: 'GROUP', group: 'RXL3lPSK8oG' }],
        ['USER_ORGUNIT', { kind: 'USER', depth: 0 }],
        ['USER_ORGUNIT_CHILDREN', { kind: 'USER', depth: 1 }],
        ['USER_ORGUNIT_GRANDCHILDREN', { kind: 'USER', depth: 2 }],
        ['not an id', { kind: 'UNKNOWN' }],
    ])('reads %s', (id, expected) => {
        expect(parseOrgUnitItem(id)).toEqual({ id, ...expected })
    })
})

describe('readOrgUnitSelection', () => {
    it('judges units on their own', () => {
        expect(readOrgUnitSelection(['unitAAAAAAA', 'unitBBBBBBB'])).toEqual({
            items: [
                { id: 'unitAAAAAAA', kind: 'UNIT' },
                { id: 'unitBBBBBBB', kind: 'UNIT' },
            ],
            boundaries: [],
        })
    })

    it('takes the units as boundaries of a level or a group', () => {
        expect(
            readOrgUnitSelection(['unitAAAAAAA', 'LEVEL-3', 'USER_ORGUNIT'])
        ).toEqual({
            items: [
                { id: 'LEVEL-3', kind: 'LEVEL', level: 3 },
                { id: 'USER_ORGUNIT', kind: 'USER', depth: 0 },
            ],
            boundaries: ['unitAAAAAAA'],
        })
    })

    it('reads nothing from no selection', () => {
        expect(readOrgUnitSelection()).toEqual({ items: [], boundaries: [] })
    })
})

describe('getUnitsToCount', () => {
    it('counts the units of a selection', () => {
        expect(getUnitsToCount(['unitAAAAAAA', 'LEVEL-2'])).toEqual({
            unitIds: ['unitAAAAAAA'],
            needsRoots: false,
            needsUser: false,
            groupIds: [],
        })
    })

    it('counts the roots for a level alone, and the user units', () => {
        expect(getUnitsToCount(['LEVEL-2', 'USER_ORGUNIT_CHILDREN'])).toEqual({
            unitIds: [],
            needsRoots: true,
            needsUser: true,
            groupIds: [],
        })
        expect(getUnitsToCount()).toEqual({
            unitIds: [],
            needsRoots: false,
            needsUser: false,
            groupIds: [],
        })
    })

    it('lists the groups once each, with no roots for them', () => {
        expect(
            getUnitsToCount(['OU_GROUP-groupAAAAAA', 'OU_GROUP-groupAAAAAA'])
        ).toEqual({
            unitIds: [],
            needsRoots: false,
            needsUser: false,
            groupIds: ['groupAAAAAA'],
        })
    })
})

describe('getOrgUnitTargets', () => {
    const COVERAGE = {
        levels: [
            { id: 'levelNation', level: 1 },
            { id: 'levelDistri', level: 2 },
        ],
        units: {
            nation: { id: 'nation', level: 1 },
            district: { id: 'district', level: 2 },
            facility: { id: 'facility', level: 4 },
        },
        roots: ['nation'],
        userUnits: ['district'],
        groups: { groupAAAAAA: { 2: 3, 3: 0, 4: 5 } },
    }
    const targets = (id, boundaries = [], coverage = COVERAGE) =>
        getOrgUnitTargets(parseOrgUnitItem(id), boundaries, coverage)

    it('asks a unit at its own level', () => {
        expect(targets('district')).toBeNull()
        expect(
            getOrgUnitTargets({ id: 'district', kind: 'UNIT' }, [], COVERAGE)
        ).toEqual([{ unitId: 'district', level: 2 }])
    })

    it('asks a level under each boundary that is above it', () => {
        expect(targets('LEVEL-3', ['nation', 'facility'])).toEqual([
            { unitId: 'nation', level: 3 },
        ])
    })

    it('asks a level under the roots without boundaries, by number or id', () => {
        expect(targets('LEVEL-levelDistri')).toEqual([
            { unitId: 'nation', level: 2 },
        ])
    })

    it('asks the user units at their level plus the depth', () => {
        expect(targets('USER_ORGUNIT_GRANDCHILDREN')).toEqual([
            { unitId: 'district', level: 4 },
        ])
    })

    it('asks a group at each level its members are at', () => {
        expect(targets('OU_GROUP-groupAAAAAA')).toEqual([
            { key: 'groupAAAAAA:2:', level: 2, group: 'groupAAAAAA' },
            { key: 'groupAAAAAA:4:', level: 4, group: 'groupAAAAAA' },
        ])
    })

    it('asks a group under each boundary at or above its members', () => {
        expect(
            targets('OU_GROUP-groupAAAAAA', ['district', 'facility'])
        ).toEqual([
            { key: 'groupAAAAAA:2:district', level: 2, group: 'groupAAAAAA' },
            { key: 'groupAAAAAA:4:district', level: 4, group: 'groupAAAAAA' },
            { key: 'groupAAAAAA:4:facility', level: 4, group: 'groupAAAAAA' },
        ])
    })

    it('cannot tell for a group, an unknown level, or units not loaded', () => {
        expect(targets('OU_GROUP-notLoadedGr')).toBeNull()
        expect(targets('OU_GROUP-groupAAAAAA', ['notLoadedUn'])).toBeNull()
        expect(targets('LEVEL-unknownLvl')).toBeNull()
        expect(targets('LEVEL-3', ['notLoadedUn'])).toBeNull()
        expect(
            targets('USER_ORGUNIT', [], { ...COVERAGE, userUnits: null })
        ).toBeNull()
        expect(
            targets('USER_ORGUNIT', [], { ...COVERAGE, userUnits: ['other'] })
        ).toBeNull()
    })
})
