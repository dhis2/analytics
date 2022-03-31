import { VIS_TYPE_SINGLE_VALUE } from '../../../../../../modules/visTypes.js'
import getSubtitle from '../index.js'

jest.mock('../singleValue', () => () => 'The sv filter title')
jest.mock(
    '../../../../../util/getFilterText',
    () => () => 'The default filter text'
)

describe('getSubtitle', () => {
    it('returns empty subtitle when flag hideSubtitle exists', () => {
        expect(getSubtitle({ hideSubtitle: true })).toEqual('')
    })

    it('returns the subtitle provided in the layout', () => {
        const subtitle = 'The subtitle was already set'
        expect(getSubtitle({ subtitle })).toEqual(subtitle)
    })

    it('returns subtitle for single value vis', () => {
        expect(getSubtitle({ type: VIS_TYPE_SINGLE_VALUE })).toEqual(
            'The sv filter title'
        )
    })

    describe('not dashboard', () => {
        describe('layout does not include title', () => {
            it('returns empty subtitle', () => {
                expect(getSubtitle({ filters: {} }, {}, false)).toEqual('')
            })
        })

        describe('layout includes title', () => {
            it('returns filter title as subtitle', () => {
                expect(
                    getSubtitle(
                        { filters: {}, title: 'Chart title' },
                        {},
                        false
                    )
                ).toEqual('The default filter text')
            })
        })
    })

    describe('dashboard', () => {
        it('returns filter title as subtitle', () => {
            expect(getSubtitle({ filters: {} }, {}, true)).toEqual(
                'The default filter text'
            )
        })
    })
})
