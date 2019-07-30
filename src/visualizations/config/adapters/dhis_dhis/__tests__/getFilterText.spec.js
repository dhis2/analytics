import getFilterText from '../getFilterText'

describe('getFilterText', () => {
    it('returns null when no filter array', () => {
        expect(getFilterText('abc')).toEqual('')
    })

    it('returns null when filter array does not contain items', () => {
        expect(getFilterText([])).toEqual('')
    })

    it('returns the filter text', () => {
        const filters = [
            {
                dimension: 'ou',
                items: [
                    {
                        id: 'topdown',
                    },
                ],
            },
            {
                dimension: 'pe',
                items: [
                    {
                        id: 'eon',
                    },
                    {
                        id: 'future',
                    },
                ],
            },
        ]

        const metadata = {
            items: {
                eon: {
                    name: 'Eons ago',
                },
                topdown: {
                    name: 'Top-down',
                },
                future: {
                    name: 'The Future',
                },
            },
        }
        expect(getFilterText(filters, metadata)).toEqual(
            'Top-down - Eons ago, The Future'
        )
    })
})
