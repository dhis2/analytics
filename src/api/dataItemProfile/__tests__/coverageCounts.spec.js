import { isCounted, mergeCounts, recordCount } from '../coverageCounts.js'

describe('coverageCounts', () => {
    it('records totals, source counts per level, and ancestors that add up', () => {
        const counts = {}

        recordCount(counts, ['districtAAA', 'total', 3], 4)
        recordCount(counts, ['districtAAA', 'formMonth', 3], 2)
        recordCount(counts, ['groupKey', 'formMonth', 'ancestors'], 1)
        recordCount(counts, ['groupKey', 'formMonth', 'ancestors'], 2)

        expect(counts).toEqual({
            districtAAA: {
                totals: { 3: 4 },
                sources: { formMonth: { byLevel: { 3: 2 } } },
            },
            groupKey: {
                totals: {},
                sources: { formMonth: { byLevel: {}, ancestors: 3 } },
            },
        })
    })

    it('tells a count of 0 from one not fetched', () => {
        const counts = {}

        recordCount(counts, ['districtAAA', 'formMonth', 3], 0)
        recordCount(counts, ['districtAAA', 'formMonth', 'ancestors'], 0)

        expect(isCounted(counts, ['districtAAA', 'formMonth', 3])).toBe(true)
        expect(
            isCounted(counts, ['districtAAA', 'formMonth', 'ancestors'])
        ).toBe(true)
        expect(isCounted(counts, ['districtAAA', 'formMonth', 2])).toBe(false)
        expect(isCounted(counts, ['districtAAA', 'formQuart', 3])).toBe(false)
        expect(isCounted(counts, ['districtAAA', 'total', 3])).toBe(false)
        expect(isCounted(undefined, ['districtAAA', 'total', 3])).toBe(false)
    })

    it('merges counts source by source and level by level', () => {
        expect(
            mergeCounts(
                {
                    districtAAA: {
                        totals: { 3: 4 },
                        sources: {
                            formMonth: { byLevel: { 3: 2 }, ancestors: 1 },
                        },
                    },
                },
                {
                    districtAAA: {
                        totals: { 2: 1 },
                        sources: {
                            formMonth: { byLevel: { 2: 0 } },
                            formQuart: { byLevel: { 2: 1 } },
                        },
                    },
                    districtBBB: { totals: {}, sources: {} },
                }
            )
        ).toEqual({
            districtAAA: {
                totals: { 2: 1, 3: 4 },
                sources: {
                    formMonth: { byLevel: { 2: 0, 3: 2 }, ancestors: 1 },
                    formQuart: { byLevel: { 2: 1 } },
                },
            },
            districtBBB: { totals: {}, sources: {} },
        })
        expect(mergeCounts()).toEqual({})
    })
})
