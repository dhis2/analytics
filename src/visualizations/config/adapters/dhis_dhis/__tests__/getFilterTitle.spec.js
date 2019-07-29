import getFilterTitle from '../getFilterTitle'

describe('getFilterTitle', () => {
    it('returns null when no filter array', () => {
        expect(getFilterTitle('abc')).toBeNull()
    })

    it('returns null when no filter array does not contain items', () => {
        expect(getFilterTitle([])).toBeNull()
    })

    it('creates the filter title', () => {
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
        expect(getFilterTitle(filters, metadata)).toEqual(
            'Top-down - Eons ago, The Future'
        )
    })
})
