import { groupInterpretationIdsByDate } from '../groupInterpretationIdsByDate.js'

describe('groupInterpretationIdsByDate', () => {
    it('should group interpretations by date and sort them correctly', () => {
        const interpretations = [
            { id: 'id1', created: '2025-09-04T07:47:12.477' },
            { id: 'id2', created: '2025-09-04T15:30:45.123' },
            { id: 'id3', created: '2025-09-03T10:20:30.456' },
            { id: 'id4', created: '2025-09-05T09:15:22.789' },
            { id: 'id5', created: '2025-09-03T18:45:15.012' },
        ]

        const result = groupInterpretationIdsByDate(interpretations)

        // Check that dates are grouped correctly
        expect(Object.keys(result)).toEqual([
            '2025-09-05',
            '2025-09-04',
            '2025-09-03',
        ])

        // Check that within each date group, items are sorted from most recent to oldest
        expect(result['2025-09-04']).toEqual(['id2', 'id1']) // 15:30 before 07:47
        expect(result['2025-09-03']).toEqual(['id5', 'id3']) // 18:45 before 10:20
        expect(result['2025-09-05']).toEqual(['id4'])
    })

    it('should handle empty array', () => {
        const interpretations = []

        const result = groupInterpretationIdsByDate(interpretations)

        expect(result).toEqual({})
    })
})
