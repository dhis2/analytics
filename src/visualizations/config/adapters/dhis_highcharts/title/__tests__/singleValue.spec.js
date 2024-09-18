import { getSingleValueTitleText } from '../singleValue.js'

jest.mock('../../../../../util/getFilterText', () => () => 'The filter text')

describe('getSingleValueTitle', () => {
    it('returns empty title when flag hideTitle exists', () => {
        expect(getSingleValueTitleText({ hideTitle: true })).toEqual('')
    })

    it('returns the title provided in the layout', () => {
        const title = 'The title was already set'
        expect(getSingleValueTitleText({ title })).toEqual(title)
    })

    it('returns null when layout does not have columns', () => {
        expect(getSingleValueTitleText({})).toEqual('')
    })

    it('returns the filter text based on column items', () => {
        expect(
            getSingleValueTitleText({
                columns: [
                    {
                        items: [{}],
                    },
                ],
            })
        ).toEqual('The filter text')
    })

    describe('not dashboard', () => {
        it('returns filter text as title', () => {
            expect(
                getSingleValueTitleText(
                    {
                        columns: [
                            {
                                items: [{}],
                            },
                        ],
                        filters: [],
                    },
                    {},
                    false
                )
            ).toEqual('The filter text')
        })
    })

    describe('dashboard', () => {
        it('returns empty string', () => {
            expect(getSingleValueTitleText({ filters: {} }, {}, true)).toEqual(
                ''
            )
        })
    })
})
