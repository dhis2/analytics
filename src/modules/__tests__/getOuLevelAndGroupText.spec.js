import { getOuLevelAndGroupText } from '../getOuLevelAndGroupText'

describe('getOuLevelAndGroupText', () => {
    let filter = {}

    const metaData = {
        dimensions: {
            ou: [
                'LEVEL-2nd-floor',
                'OU_GROUP-fruit',
                'OU_GROUP-veggies',
                '_SierraLeone_',
            ],
        },
        items: {
            _SierraLeone_: {
                name: 'Sierra Leone',
                uid: '_SierraLeone_',
            },
            fruit: {
                name: 'Fruit',
                uid: 'fruit',
            },
            veggies: {
                name: 'Veggies',
                uid: 'veggies',
            },
            '2nd-floor': {
                name: 'Second floor',
                uid: '2nd-floor',
            },
        },
    }

    beforeEach(() => {
        filter = {
            dimension: 'ou',
        }
    })

    it('summarizes ou levels and groups', () => {
        filter.items = [
            { id: 'LEVEL-2nd-floor' },
            { id: 'OU_GROUP-fruit' },
            { id: 'OU_GROUP-veggies' },
            { id: '_SierraLeone_' },
        ]
        expect(getOuLevelAndGroupText(filter, metaData)).toEqual(
            'Fruit and Veggies groups in Sierra Leone - Second floor levels in Sierra Leone'
        )
    })

    it('summarizes ou levels and groups when no root ou', () => {
        filter.items = [
            { id: 'LEVEL-2nd-floor' },
            { id: 'OU_GROUP-fruit' },
            { id: 'OU_GROUP-veggies' },
        ]

        expect(getOuLevelAndGroupText(filter, metaData)).toEqual(
            'Fruit and Veggies groups - Second floor levels'
        )
    })
})
