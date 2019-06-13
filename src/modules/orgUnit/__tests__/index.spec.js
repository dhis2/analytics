import { orgUnit } from '..'

describe('orgUnit', () => {
    it('returns the id with the "LEVEL-" prefix', () => {
        expect(orgUnit.getGroupId('fruit-group')).toEqual(
            'OU_GROUP-fruit-group'
        )
    })

    it('returns the id with the "OU_GROUP-" prefix', () => {
        expect(orgUnit.getLevelId('2nd-floor')).toEqual('LEVEL-2nd-floor')
    })

    it('returns the uid of a level-id', () => {
        expect(orgUnit.getUid('LEVEL-2nd-floor')).toEqual('2nd-floor')
    })

    it('returns the uid of a group-id', () => {
        expect(orgUnit.getUid('OU_GROUP-fruit-group')).toEqual('fruit-group')
    })

    it('returns the uid of plain orgunit id', () => {
        expect(orgUnit.getUid('lmao')).toEqual('lmao')
    })

    it('returns false for empty string', () => {
        expect(orgUnit.isGroupId('')).toBe(false)
    })

    it('returns true for group id', () => {
        const id = 'OU_GROUP-fruit-group'

        expect(orgUnit.isGroupId(id)).toBe(true)
    })

    it('returns false for non-group id', () => {
        const id = 'NON_GROUP_ID'

        expect(orgUnit.isGroupId(id)).toBe(false)
    })

    it('returns false for empty string', () => {
        expect(orgUnit.isLevelId('')).toBe(false)
    })

    it('returns true for level id', () => {
        const id = 'LEVEL-2nd-floor'

        expect(orgUnit.isLevelId(id)).toBe(true)
    })

    it('returns false for non-level id', () => {
        const id = 'NON_LEVEL_ID'

        expect(orgUnit.isLevelId(id)).toBe(false)
    })
})
