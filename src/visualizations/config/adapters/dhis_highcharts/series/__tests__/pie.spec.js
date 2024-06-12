import { formatDataLabel } from '../pie.js'

describe('formatDataLabel', () => {
    it('should format data label correctly with integers', () => {
        const result = formatDataLabel('Test', 1000, 50)
        expect(result).toEqual(
            '<span style="font-weight:normal">Test</span><br/>1 000<span style="font-weight:normal"> (50%)</span>'
        )
    })

    it('should format data label correctly with decimals', () => {
        const result = formatDataLabel('Test', 1000.123456789, 50.1234)
        expect(result).toEqual(
            '<span style="font-weight:normal">Test</span><br/>1 000.123456789<span style="font-weight:normal"> (50.1%)</span>'
        )
    })

    it('should handle large numbers correctly', () => {
        const result = formatDataLabel('Test', 1000000, 75.5678)
        expect(result).toEqual(
            '<span style="font-weight:normal">Test</span><br/>1 000 000<span style="font-weight:normal"> (75.6%)</span>'
        )
    })

    it('should handle small percentages correctly', () => {
        const result = formatDataLabel('Test', 1000.000001, 0.09)
        expect(result).toEqual(
            '<span style="font-weight:normal">Test</span><br/>1 000.000001<span style="font-weight:normal"> (0.1%)</span>'
        )
    })

    it('should handle zero correctly', () => {
        const result = formatDataLabel('Test', 0, 0)
        expect(result).toEqual(
            '<span style="font-weight:normal">Test</span><br/>0<span style="font-weight:normal"> (0%)</span>'
        )
    })

    it('should handle negative numbers correctly', () => {
        const result = formatDataLabel('Test', -1000, -50)
        expect(result).toEqual(
            '<span style="font-weight:normal">Test</span><br/>-1 000<span style="font-weight:normal"> (-50%)</span>'
        )
    })

    it('should handle empty string as name correctly', () => {
        const result = formatDataLabel('', 1000, 50)
        expect(result).toEqual(
            '<span style="font-weight:normal"></span><br/>1 000<span style="font-weight:normal"> (50%)</span>'
        )
    })

    it('should handle undefined as name correctly', () => {
        const result = formatDataLabel(undefined, 1000, 50)
        expect(result).toEqual(
            '<span style="font-weight:normal"></span><br/>1 000<span style="font-weight:normal"> (50%)</span>'
        )
    })

    it('should handle special characters in name correctly', () => {
        const result = formatDataLabel('Test&Test', 1000, 50)
        expect(result).toEqual(
            '<span style="font-weight:normal">Test&Test</span><br/>1 000<span style="font-weight:normal"> (50%)</span>'
        )
    })
})
