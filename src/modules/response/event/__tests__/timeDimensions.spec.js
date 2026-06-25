import { transformResponse } from '../response.js'

const months = ['202505', '202506', '202507']

// Minimal enrollment/aggregate-style response with NO data rows.
// The server still returns the full relative-period buckets in
// metaData.dimensions for the period dimensions.
const makeEmptyResponse = () => ({
    headers: [
        { name: 'value', valueType: 'NUMBER', meta: false },
        { name: 'enrollmentdate', valueType: 'TEXT', meta: true },
        { name: 'A03MvHHogjR.eventdate', valueType: 'DATE', meta: true },
    ],
    metaData: {
        items: months.reduce((o, m) => ({ ...o, [m]: { name: m } }), {}),
        dimensions: {
            enrollmentdate: [...months],
            'A03MvHHogjR.eventdate': [...months],
        },
    },
    rows: [],
})

describe('transformResponse - time dimension members', () => {
    it('preserves the bare program-level time dimension members when there are no rows', () => {
        const { metaData } = transformResponse(makeEmptyResponse())

        // Regression: applyDefaultHandler used to re-derive enrollmentdate's
        // members from the (empty) rows and overwrite the server buckets with
        // [], collapsing the pivot table (dataWidth -> 0 -> cellType crash).
        expect(metaData.dimensions.enrollmentdate).toEqual(months)
    })

    it('preserves the stage-prefixed time dimension members when there are no rows', () => {
        const { metaData } = transformResponse(makeEmptyResponse())

        expect(metaData.dimensions['A03MvHHogjR.eventdate']).toEqual(months)
    })
})
