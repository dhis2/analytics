import getFilterText from '../getFilterText'

let filters
let metaData

describe('getFilterText', () => {
    beforeEach(() => {
        filters = [
            {
                dimension: '_facilityType_',
                items: [
                    {
                        id: '_clinic_',
                        name: 'Clinics',
                    },
                    {
                        id: '_hospital_',
                        name: 'Hospital',
                    },
                ],
            },
        ]

        metaData = {
            dimensions: {
                _facilityType_: ['_clinic_', '_hospital_'],
            },
            items: {
                _clinic_: {
                    name: 'Clinics',
                    uid: '_clinic_',
                },
                _hospital_: {
                    name: 'Hospital',
                    uid: '_hospital_',
                },
            },
        }
    })

    it('joins items with a comma', () => {
        expect(getFilterText(filters, metaData)).toEqual('Clinics, Hospital')
    })

    it('joins filters with a " - "', () => {
        filters.push({
            dimension: '_period_',
            items: [
                {
                    id: '_201801_',
                    name: '01 of 2018',
                },
                {
                    id: '_201802_',
                    name: '02 of 2018',
                },
            ],
        })

        metaData.dimensions._period_ = ['_201801_', '_201802_']
        metaData.items._201801_ = {
            name: '01 of 2018',
            uid: '_201801_',
        }
        metaData.items._201802_ = {
            name: '02 of 2018',
            uid: '_201802_',
        }

        expect(getFilterText(filters, metaData)).toEqual(
            'Clinics, Hospital - 01 of 2018, 02 of 2018'
        )
    })

    it('summarizes ou levels and groups', () => {
        filters.push({
            dimension: 'ou',
            items: [
                {
                    id: 'LEVEL-2nd-floor',
                },
                {
                    id: 'OU_GROUP-fruit',
                },
                {
                    id: 'OU_GROUP-veggies',
                },
                {
                    id: '_SierraLeone_',
                },
            ],
        })

        metaData.dimensions.ou = [
            'LEVEL-2nd-floor',
            'OU_GROUP-fruit',
            'OU_GROUP-veggies',
            '_SierraLeone_',
        ]
        metaData.items._SierraLeone_ = {
            name: 'Sierra Leone',
            uid: '_SierraLeone_',
        }
        metaData.items['fruit'] = {
            name: 'Fruit',
            uid: 'fruit',
        }
        metaData.items['veggies'] = {
            name: 'Veggies',
            uid: 'veggies',
        }
        metaData.items['2nd-floor'] = {
            name: 'Second floor',
            uid: '2nd-floor',
        }

        expect(getFilterText(filters, metaData)).toEqual(
            'Clinics, Hospital - Fruit and Veggies groups in Sierra Leone - Second floor levels in Sierra Leone'
        )
    })

    describe('metadata is missing', () => {
        it('uses uids in the title', () => {
            filters.push({
                dimension: '_facilityOwnership_',
                items: [
                    {
                        id: '_mission_',
                        name: 'Mission',
                    },
                    {
                        id: '_NGO_',
                        name: 'NGO',
                    },
                ],
            })
            metaData.dimensions._facilityOwnership_ = ['_mission_', '_NGO_']
            metaData.items._facilityOwnership_ = {
                name: 'Facility Ownership',
                uid: '_facilityOwnership_',
            }

            expect(getFilterText(filters, metaData)).toEqual(
                'Clinics, Hospital - Facility Ownership: _mission_, _NGO_'
            )
        })
    })
})
