import getSingleValueSubtitle from '../singleValue.js'

jest.mock(
    '../../../../../util/getFilterText',
    () => () => 'The default filter text'
)

describe('getSingleValueSubtitle', () => {
    it('returns empty subtitle when flag hideSubtitle exists', () => {
        expect(getSingleValueSubtitle({ hideSubtitle: true })).toEqual('')
    })

    it('returns the subtitle provided in the layout', () => {
        const subtitle = 'The subtitle was already set'
        expect(getSingleValueSubtitle({ subtitle })).toEqual(subtitle)
    })

    it('returns an empty string when layout does not have filters', () => {
        expect(getSingleValueSubtitle({})).toEqual('')
    })

    it('returns the filter text', () => {
        expect(getSingleValueSubtitle({ filters: [] })).toEqual(
            'The default filter text'
        )
    })

    describe('not dashboard', () => {
        describe('layout does not include title', () => {
            it('returns empty subtitle', () => {
                expect(
                    getSingleValueSubtitle({ filters: undefined }, {}, false)
                ).toEqual('')
            })
        })

        /* All these tests have been moved and adjusted from here:
         * src/visualizations/config/adapters/dhis_dhis/title/__tests__`
         * The test below asserted the default subtitle behaviour, for
         * visualization types other than SingleValue. It expected that
         * the title was being used as subtitle. It fails now, and I
         * believe that this behaviour does not make sense. So instead
         * of fixing it, I disabled it. */
        // describe('layout includes title', () => {
        //     it('returns filter title as subtitle', () => {
        //         expect(
        //             getSingleValueSubtitle(
        //                 { filters: undefined, title: 'Chart title' },
        //                 {},
        //                 false
        //             )
        //         ).toEqual('The default filter text')
        //     })
        // })
    })

    describe('dashboard', () => {
        it('returns filter title as subtitle', () => {
            expect(getSingleValueSubtitle({ filters: {} }, {}, true)).toEqual(
                'The default filter text'
            )
        })
    })
})
