import { VIS_TYPE_SINGLE_VALUE } from '../../../../../../modules/visTypes.js'
import getSingleValueTitle from '../singleValue.js'

jest.mock('../../../../../util/getFilterText', () => () => 'The filter text')

describe('getSingleValueTitle', () => {
    it('returns empty title when flag hideTitle exists', () => {
        expect(getSingleValueTitle({ hideTitle: true })).toEqual('')
    })

    it('returns the title provided in the layout', () => {
        const title = 'The title was already set'
        expect(getSingleValueTitle({ title })).toEqual(title)
    })

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

    describe('not dashboard', () => {
        it('returns filter text as title', () => {
            expect(
                getSingleValueTitle(
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
            expect(getSingleValueTitle({ filters: {} }, {}, true)).toEqual('')
        })
    })
})
