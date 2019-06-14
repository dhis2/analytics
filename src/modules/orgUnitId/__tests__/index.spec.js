import { orgUnitId } from '../index'

describe('orgUnitId', () => {
    it('returns the id with the "OU_GROUP-" prefix', () => {
        expect(orgUnitId.addGroupPrefix('fruit-group')).toEqual(
            'OU_GROUP-fruit-group'
        )
    })

    it('returns the id with the "GROUP-" prefix when id already contained GROUP-', () => {
        expect(orgUnitId.addGroupPrefix('OU_GROUP-fruit-group')).toEqual(
            'OU_GROUP-fruit-group'
        )
    })

    it('returns the id with the "LEVEL-" prefix', () => {
        expect(orgUnitId.addLevelPrefix('2nd-floor')).toEqual('LEVEL-2nd-floor')
    })

    it('returns the id with the "LEVEL-" prefix when id already contained LEVEL-', () => {
        expect(orgUnitId.addLevelPrefix('LEVEL-2nd-floor')).toEqual(
            'LEVEL-2nd-floor'
        )
    })

    it('returns the uid of a level-id', () => {
        expect(orgUnitId.removePrefix('LEVEL-2nd-floor')).toEqual('2nd-floor')
    })

    it('returns the uid of a group-id', () => {
        expect(orgUnitId.removePrefix('OU_GROUP-fruit-group')).toEqual(
            'fruit-group'
        )
    })

    it('returns the uid of plain orgunit id', () => {
        expect(orgUnitId.removePrefix('lmao')).toEqual('lmao')
    })

    it('returns false for empty string', () => {
        expect(orgUnitId.hasGroupPrefix('')).toBe(false)
    })

    it('returns true for group id', () => {
        const id = 'OU_GROUP-fruit-group'

        expect(orgUnitId.hasGroupPrefix(id)).toBe(true)
    })

    it('returns false for non-group id', () => {
        const id = 'NON_GROUP_ID'

        expect(orgUnitId.hasGroupPrefix(id)).toBe(false)
    })

    it('returns false for empty string', () => {
        expect(orgUnitId.hasLevelPrefix('')).toBe(false)
    })

    it('returns true for level id', () => {
        const id = 'LEVEL-2nd-floor'

        expect(orgUnitId.hasLevelPrefix(id)).toBe(true)
    })

    it('returns false for non-level id', () => {
        const id = 'NON_LEVEL_ID'

        expect(orgUnitId.hasLevelPrefix(id)).toBe(false)
    })
})
