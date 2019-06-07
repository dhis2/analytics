import { getOuUid } from '../getOuUid'

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
