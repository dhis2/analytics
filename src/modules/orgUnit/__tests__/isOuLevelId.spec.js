import { isOuLevelId } from '../isOuLevelId'
import { LEVEL_ID_PREFIX } from '../internal/constants'

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
