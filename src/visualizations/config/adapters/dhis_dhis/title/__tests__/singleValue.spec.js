import getSingleValueTitle from '../singleValue'

jest.mock('../../getFilterText', () => () => 'The filter text')

describe('getSingleValueTitle', () => {
    it('returns null when layout does not have columns', () => {
        expect(getSingleValueTitle({})).toEqual('')
    })

    it('returns the filter text based on column items', () => {
        expect(
            getSingleValueTitle({
                columns: [
                    {
                        items: [{}],
                    },
                ],
            })
        ).toEqual('The filter text')
    })
})
