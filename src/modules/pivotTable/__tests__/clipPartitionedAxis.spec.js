import { clipPartitionedAxis } from '../clipPartitionedAxis.js'

describe('clipPartitionedAxis', () => {
    it('renders no indices for an empty axis (no partitions)', () => {
        // A degenerate matrix (e.g. a dimension with no members) yields an
        // empty axis map and therefore no partitions. This must render nothing
        // rather than a phantom index 0 that isn't in the map (which made
        // engine.get return undefined and PivotTableValueCell throw).
        const result = clipPartitionedAxis({
            partitionSize: 400,
            partitions: [],
            axisMap: [],
            widthMap: [],
            viewportWidth: 1000,
            viewportPosition: 0,
            totalWidth: 0,
        })

        expect(result.indices).toEqual([])
        expect(result.pre).toBe(0)
        expect(result.post).toBe(0)
    })

    it('still falls back to index 0 when scrolled past the last partition of a non-empty axis', () => {
        const result = clipPartitionedAxis({
            partitionSize: 400,
            partitions: [0],
            axisMap: [0],
            widthMap: [{ pre: 0, size: 100 }],
            viewportWidth: 500,
            viewportPosition: 100000, // far beyond the only partition
            totalWidth: 100,
        })

        expect(result.indices).toEqual([0])
    })
})
