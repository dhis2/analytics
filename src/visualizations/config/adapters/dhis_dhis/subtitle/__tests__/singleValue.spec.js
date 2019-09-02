import getSingleValueSubtitle from '../singleValue'

jest.mock('../../../../../util/getFilterText', () => () => 'The filter text')

describe('getSingleValueSubtitle', () => {
    it('returns null when layout does not have filters', () => {
        expect(getSingleValueSubtitle({})).toEqual('')
    })

    it('returns the filter text', () => {
        expect(getSingleValueSubtitle({ filters: [] })).toEqual(
            'The filter text'
        )
    })
})
