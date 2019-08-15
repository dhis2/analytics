import { getOuFilterText } from '../getOuFilterText'

describe('getOuFilterText', () => {
    it('summarizes ou levels and groups', () => {
        const filter = {
            dimension: 'ou',
            items: [
                { id: 'LEVEL-2nd-floor' },
                { id: 'OU_GROUP-fruit' },
                { id: 'OU_GROUP-veggies' },
                { id: '_SierraLeone_' },
            ],
        }

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

        expect(getOuFilterText(filter, metaData)).toEqual(
            'Fruit and Veggies groups in Sierra Leone - Second floor levels in Sierra Leone'
        )
    })
})
