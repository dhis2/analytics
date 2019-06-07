import { isOuGroupId } from '../isOuGroupId'
import { GROUP_ID_PREFIX } from '../internal/constants'

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
