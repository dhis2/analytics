// import { getOuLevelsFromIds } from '../orgUnit'

const levelOptions = [{ id: '2nd-floor' }, { id: '3rd-floor' }]

import {
    LEVEL_ID_PREFIX,
    GROUP_ID_PREFIX,
    isOuLevelId,
    isOuGroupId,
    getOrgUnitPath,
    getOrgUnitsFromIds,
    getOuLevelsFromIds,
    getOuGroupsFromIds,
    sortOrgUnitLevels,
    transformOptionsIntoMetadata,
    getOuUid,
} from '../orgUnit'

describe('isOuLevelId', () => {
    it('returns false for empty string', () => {
        expect(isOuLevelId('')).toBe(false)
    })

    it('returns true for level id', () => {
        const id = `${LEVEL_ID_PREFIX}-ID`

        expect(isOuLevelId(id)).toBe(true)
    })

    it('returns false for non-level id', () => {
        const id = 'NON_LEVEL_ID'

        expect(isOuLevelId(id)).toBe(false)
    })
})

describe('getOuUid', () => {
    it('returns the uid of a level-id', () => {
        expect(getOuUid('LEVEL-2nd-floor')).toEqual('2nd-floor')
    })

    it('returns the uid of a group-id', () => {
        expect(getOuUid('OU_GROUP-fruit-group')).toEqual('fruit-group')
    })

    it('returns the uid of plain orgunit id', () => {
        expect(getOuUid('lmao')).toEqual('lmao')
    })
})

describe('isOuGroupId', () => {
    it('returns false for empty string', () => {
        expect(isOuGroupId('')).toBe(false)
    })

    it('returns true for group id', () => {
        const id = `${GROUP_ID_PREFIX}-ID`

        expect(isOuGroupId(id)).toBe(true)
    })

    it('returns false for non-group id', () => {
        const id = 'NON_GROUP_ID'

        expect(isOuGroupId(id)).toBe(false)
    })
})

describe('getOrgUnitPath', () => {
    it('handles root org units', () => {
        const id = 'ROOT_ID'
        const metadata = {}
        const parentGraphMap = { ROOT_ID: '' }

        expect(getOrgUnitPath(id, metadata, parentGraphMap)).toEqual('/ROOT_ID')
    })

    it('returns path for org unit defined in metadata', () => {
        const path = 'path'
        const id = 'ORG_UNIT_ID'
        const metadata = {
            [id]: { path },
        }

        expect(getOrgUnitPath(id, metadata)).toEqual(path)
    })

    it('returns proper path for org unit not defined in metadata, but in parent graph', () => {
        const id = 'ORG_UNIT_ID'
        const path = 'path'
        const metadata = {}
        const parentGraphMap = { [id]: path }

        expect(getOrgUnitPath(id, metadata, parentGraphMap)).toEqual(
            `/${path}/${id}`
        )
    })
})

describe('getOrgUnitsFromIds', () => {
    it('returns org unit objects with id, name and path', () => {
        const levelUid = '2nd-floor'
        const groupUid = 'fruit-group'
        const ids = [
            'ID0',
            'ID1',
            `${LEVEL_ID_PREFIX}-${levelUid}`,
            `${GROUP_ID_PREFIX}-${groupUid}`,
        ]
        const metadata = {
            [ids[0]]: {
                id: ids[0],
                name: 'Org unit 0',
                path: `/${ids[0]}`,
            },
            [ids[1]]: {
                id: ids[1],
                name: 'Org unit 1',
                path: `/${ids[1]}`,
            },
            [levelUid]: {
                id: levelUid,
                name: '2nd Floor',
            },
            [groupUid]: {
                id: groupUid,
                name: 'Fruit Group',
            },
        }
        const metadataVals = Object.values(metadata)

        const orgUnits = getOrgUnitsFromIds(ids, metadata, {})

        expect(orgUnits.length).toEqual(4)

        orgUnits.forEach((orgUnit, i) => {
            expect(orgUnit.id).toEqual(ids[i])
            expect(orgUnit.name).toEqual(metadataVals[i].name)
            expect(orgUnit.path).toEqual(metadataVals[i].path)
        })
    })

    it('returns empty array if there no org units in ou dimension', () => {
        const ids = []
        const metadata = {}
        const parentGraphMap = {}

        expect(getOrgUnitsFromIds(ids, metadata, parentGraphMap)).toEqual([])
    })
})

describe('getOuLevelsFromIds', () => {
    it('returns empty array if there are no level options', () => {
        const ids = []

        expect(getOuLevelsFromIds(ids, levelOptions)).toEqual([])
    })

    it('returns array with uids when level-ids received', () => {
        expect(
            getOuLevelsFromIds(['abc', 'LEVEL-2nd-floor'], levelOptions)
        ).toEqual(['2nd-floor'])
    })

    it('returns empty array when level-id not received', () => {
        expect(getOuLevelsFromIds(['abc', 'rarity'], levelOptions)).toEqual([])
    })

    it('returns empty array if ids array is empty', () => {
        const result = getOuLevelsFromIds([], [{}])

        expect(result).toEqual([])
    })
})

describe('getOuGroupsFromIds', () => {
    it('returns empty array if there are no group options', () => {
        const ids = []
        const groupOptions = []

        expect(getOuGroupsFromIds(ids, groupOptions)).toEqual([])
    })

    it('returns groups from ids', () => {
        const groupId1 = 'fruit-group'
        const groupId2 = 'veggie-group'
        const ids = [
            `${GROUP_ID_PREFIX}-${groupId1}`,
            `${GROUP_ID_PREFIX}-${groupId2}`,
            'ANOTHER_ID',
            'SOME_OTHER_ID',
        ]
        const groupOptions = [{ id: groupId1 }, { id: groupId2 }]

        const result = getOuGroupsFromIds(ids, groupOptions)

        expect(result.length).toEqual(2)
        expect(result.includes(groupId1)).toBe(true)
        expect(result.includes(groupId2)).toBe(true)
    })

    it('returns empty array if ids array is empty', () => {
        const result = getOuGroupsFromIds([], [{}])

        expect(result).toEqual([])
    })
})

describe('sortOrgUnitLevels', () => {
    it('returns empty array on empty input', () => {
        expect(sortOrgUnitLevels([])).toEqual([])
    })

    it('sorts array by level ASC', () => {
        const options = [{ level: 3 }, { level: 4 }, { level: 1 }, { level: 2 }]
        const sortedOptions = [
            { level: 1 },
            { level: 2 },
            { level: 3 },
            { level: 4 },
        ]

        expect(sortOrgUnitLevels(options)).toEqual(sortedOptions)
    })
})

describe('transformOptionsIntoMetadata', () => {
    it('returns appropriate result for empty options', () => {
        const options = []
        const metadata = {}

        const result = transformOptionsIntoMetadata(options, metadata)

        expect(result.options.length).toEqual(0)
        expect(Object.keys(result.metadata).length).toEqual(0)
    })

    it('transforms options into metadata', () => {
        const options = [
            { id: 'OPTION_ID_1', name: 'Option 1', displayName: 'Option 1' },
            { id: 'OPTION_ID_2', name: 'Option 2', displayName: 'Option 2' },
        ]
        const metadata = {}

        const result = transformOptionsIntoMetadata(options, metadata)

        expect(Object.keys(result.metadata).length).toEqual(2)
        expect(result.options).toEqual(options)

        options.forEach(option => {
            expect(result.metadata[option.id]).toEqual(option)
        })
    })

    it('skips options which are already in metadata', () => {
        const options = [
            { id: 'OPTION_ID_1', name: 'Option 1', displayName: 'Option 1' },
            { id: 'OPTION_ID_2', name: 'Option 2', displayName: 'Option 2' },
            { id: 'OPTION_ID_3', name: 'Option 3', displayName: 'Option 3' },
            { id: 'OPTION_ID_4', name: 'Option 4', displayName: 'Option 4' },
        ]
        const metadata = {
            OPTION_ID_3: {
                id: 'OPTION_ID_3',
                name: 'Option 3',
                displayName: 'Option 3',
            },
            OPTION_ID_4: {
                id: 'OPTION_ID_4',
                name: 'Option 4',
                displayName: 'Option 4',
            },
        }

        const result = transformOptionsIntoMetadata(options, metadata)

        expect(Object.keys(result.metadata).length).toEqual(2)
        expect(result.options).toEqual(options)

        const metadataIds = Object.keys(metadata).map(id => id)
        const resultMetadataIds = Object.keys(result.metadata).map(id => id)

        metadataIds.forEach(id =>
            expect(resultMetadataIds.includes(id)).toBe(false)
        )
    })

    it('transforms using custom fields', () => {
        const options = [
            { id: 'OPTION_ID_1', customProperty: 'Custom property 1' },
            { id: 'OPTION_ID_2', customProperty: 'Custom property 2' },
        ]
        const metadata = {}

        const result = transformOptionsIntoMetadata(options, metadata, [
            'id',
            'customProperty',
        ])

        expect(result.options).toEqual(options)
        expect(Object.keys(result.metadata).length).toEqual(options.length)

        Object.keys(result.metadata).forEach(id => {
            expect(result.metadata[id]).toEqual(
                options.find(option => option.id === id)
            )
        })
    })
})
