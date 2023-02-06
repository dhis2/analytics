import { ouIdHelper } from '../index.js'

describe('ouIdHelper', () => {
    describe('addGroupPrefix', () => {
        it('returns the id with the "OU_GROUP-" prefix', () => {
            expect(ouIdHelper.addGroupPrefix('fruit-group')).toEqual(
                'OU_GROUP-fruit-group'
            )
        })

        it('returns the id with the "OU_GROUP-" prefix when id already contained GROUP-', () => {
            expect(ouIdHelper.addGroupPrefix('OU_GROUP-fruit-group')).toEqual(
                'OU_GROUP-fruit-group'
            )
        })
    })

    describe('addLevelPrefix', () => {
        it('returns the id with the "LEVEL-" prefix', () => {
            expect(ouIdHelper.addLevelPrefix('2nd-floor')).toEqual(
                'LEVEL-2nd-floor'
            )
        })

        it('returns the id with the "LEVEL-" prefix when id already contained LEVEL-', () => {
            expect(ouIdHelper.addLevelPrefix('LEVEL-2nd-floor')).toEqual(
                'LEVEL-2nd-floor'
            )
        })
    })

    describe('removePrefix', () => {
        it('returns the uid of a level-id', () => {
            expect(ouIdHelper.removePrefix('LEVEL-2nd-floor')).toEqual(
                '2nd-floor'
            )
        })

        it('returns the uid of a group-id', () => {
            expect(ouIdHelper.removePrefix('OU_GROUP-fruit-group')).toEqual(
                'fruit-group'
            )
        })

        it('returns the uid of plain orgunit id', () => {
            expect(ouIdHelper.removePrefix('lmao')).toEqual('lmao')
        })
    })

    describe('hasGroupPrefix', () => {
        it('returns false for empty string', () => {
            expect(ouIdHelper.hasGroupPrefix('')).toBe(false)
        })

        it('returns true for group id', () => {
            const id = 'OU_GROUP-fruit-group'

            expect(ouIdHelper.hasGroupPrefix(id)).toBe(true)
        })

        it('returns false for non-group id', () => {
            const id = 'NON_GROUP_ID'

            expect(ouIdHelper.hasGroupPrefix(id)).toBe(false)
        })
    })

    describe('hasLevelPrefix', () => {
        it('returns false for empty string', () => {
            expect(ouIdHelper.hasLevelPrefix('')).toBe(false)
        })

        it('returns true for level id', () => {
            const id = 'LEVEL-2nd-floor'

            expect(ouIdHelper.hasLevelPrefix(id)).toBe(true)
        })

        it('returns false for non-level id', () => {
            const id = 'NON_LEVEL_ID'

            expect(ouIdHelper.hasLevelPrefix(id)).toBe(false)
        })
    })
})
