import { getOuLevelId } from '../getOuLevelId'

describe('getOuLevelId', () => {
    it('returns the id with the "LEVEL-" prefix', () => {
        expect(getOuLevelId('2nd-floor')).toEqual('LEVEL-2nd-floor')
    })
})
