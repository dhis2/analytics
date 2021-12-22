import { convertOuLevelsToUids } from '../index.js'

const ouLevels = [
    {
        level: 2,
        id: '2nd-floor',
    },
]

describe('convertOuLevelsToUids', () => {
    let vis
    beforeEach(() => {
        vis = {
            other: 'abc',
            filters: [],
            rows: [],
            columns: [],
        }
    })

    it('does nothing when no ou', () => {
        vis.filters = [
            {
                dimension: 'facility_type',
                items: [
                    {
                        id: 'factype1',
                        name: 'Facility Type 1',
                    },
                ],
            },
        ]

        const updatedVis = convertOuLevelsToUids(ouLevels, vis)

        expect(updatedVis).toEqual({
            filters: [
                {
                    dimension: 'facility_type',
                    items: [
                        {
                            id: 'factype1',
                            name: 'Facility Type 1',
                        },
                    ],
                },
            ],
            rows: [],
            columns: [],
            other: 'abc',
        })
    })

    it('converts ou filters', async () => {
        vis.filters = [
            {
                dimension: 'ou',
                items: [
                    {
                        id: 'fluttershy',
                        name: 'Fluttershy',
                    },
                    {
                        id: 'LEVEL-2',
                        name: 'LEVEL-2',
                    },
                    {
                        id: 'rainbow',
                        name: 'Rainbow Dash',
                    },
                ],
            },
            {
                dimension: 'facility_type',
                items: [
                    {
                        id: 'factype1',
                        name: 'Facility Type 1',
                    },
                ],
            },
        ]

        const updatedVis = convertOuLevelsToUids(ouLevels, vis)

        expect(updatedVis).toEqual({
            filters: [
                {
                    dimension: 'ou',
                    items: [
                        { id: 'fluttershy', name: 'Fluttershy' },
                        { id: 'LEVEL-2nd-floor', name: 'LEVEL-2' },
                        { id: 'rainbow', name: 'Rainbow Dash' },
                    ],
                },
                {
                    dimension: 'facility_type',
                    items: [
                        {
                            id: 'factype1',
                            name: 'Facility Type 1',
                        },
                    ],
                },
            ],
            rows: [],
            columns: [],
            other: 'abc',
        })
    })

    it('converts ou rows', () => {
        vis.rows = [
            {
                dimension: 'ou',
                items: [
                    {
                        id: 'LEVEL-2',
                        name: 'LEVEL-2',
                    },
                ],
            },
        ]

        const updatedVis = convertOuLevelsToUids(ouLevels, vis)

        expect(updatedVis).toEqual({
            filters: [],
            columns: [],
            rows: [
                {
                    dimension: 'ou',
                    items: [{ id: 'LEVEL-2nd-floor', name: 'LEVEL-2' }],
                },
            ],
            other: 'abc',
        })
    })

    it('converts ou columns', () => {
        vis.columns = [
            {
                dimension: 'ou',
                items: [
                    {
                        id: 'LEVEL-2',
                        name: 'LEVEL-2',
                    },
                ],
            },
        ]

        const updatedVis = convertOuLevelsToUids(ouLevels, vis)

        expect(updatedVis).toEqual({
            filters: [],
            rows: [],
            columns: [
                {
                    dimension: 'ou',
                    items: [{ id: 'LEVEL-2nd-floor', name: 'LEVEL-2' }],
                },
            ],
            other: 'abc',
        })
    })
})
