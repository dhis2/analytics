import getTitle from '../index'
import { VISUALIZATION_TYPE_SINGLE_VALUE } from '../../type'

jest.mock('../singleValue', () => () => 'The sv filter title')
jest.mock('../../../../../util/getFilterText', () => () => 'The filter text')

describe('getTitle', () => {
    it('returns empty title when flag hideTitle exists', () => {
        expect(getTitle({ hideTitle: true })).toEqual('')
    })

    it('returns the title provided in the layout', () => {
        const title = 'The title was already set'
        expect(getTitle({ title })).toEqual(title)
    })

    it('returns title for single value vis', () => {
        expect(getTitle({ type: VISUALIZATION_TYPE_SINGLE_VALUE })).toEqual(
            'The sv filter title'
        )
    })

    describe('not dashboard', () => {
        it('returns filter text as title', () => {
            expect(getTitle({ filters: {} }, {}, false)).toEqual(
                'The filter text'
            )
        })
    })

    describe('dashboard', () => {
        it('returns empty string', () => {
            expect(getTitle({ filters: {} }, {}, true)).toEqual('')
        })
    })
})
