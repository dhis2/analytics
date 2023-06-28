import { DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM } from '../dataTypes.js'
import { getExpressionHashFromVisualization, getHash } from '../hash.js'

describe('getHash', () => {
    const textInput = 'Raymond Luxury Yacht'

    it('accepts a string and returns a hash', () => {
        const hash = getHash(textInput)

        expect(typeof hash).toBe('string')
        expect(hash).not.toBe(textInput)
    })

    it('is deterministic', () => {
        expect(getHash(textInput)).toBe(getHash(textInput))
    })

    it('returns undefined for invalid input', () => {
        const unsupportedTypes = ['', 1, true, null, undefined, {}, []]

        unsupportedTypes.forEach((type) =>
            expect(getHash(type)).toBe(undefined)
        )
    })
})

describe('getExpressionHashFromVisualization', () => {
    const edi1 = {
        id: 'OdiHJayrsKo',
        dimensionItemType: DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM,
        expression: '#{abc} * 10',
    }

    const edi2 = {
        id: 'Uvn6LCg7dVU',
        dimensionItemType: DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM,
        expression: '#{abc} * 20',
    }

    const dxWithEdi = {
        dimension: 'dx',
        items: [edi1, edi2],
    }

    it('generates a hash (columns)', () => {
        expect(
            typeof getExpressionHashFromVisualization({
                columns: [dxWithEdi],
                rows: [],
                filters: [],
            })
        ).toBe('string')
    })

    it('generates a hash (rows)', () => {
        expect(
            typeof getExpressionHashFromVisualization({
                columns: [],
                rows: [dxWithEdi],
                filters: [],
            })
        ).toBe('string')
    })

    it('generates a hash (filters)', () => {
        expect(
            typeof getExpressionHashFromVisualization({
                columns: [],
                rows: [],
                filters: [dxWithEdi],
            })
        ).toBe('string')
    })

    it('does not generate a hash when there are no dimensions', () => {
        expect(
            getExpressionHashFromVisualization({
                columns: [],
                rows: [],
                filters: [],
            })
        ).toBe(undefined)
    })

    it('does not generate a hash when there are no EDI dimensions', () => {
        expect(
            getExpressionHashFromVisualization({
                columns: [
                    {
                        id: 'OdiHJayrsKo',
                        dimensionItemType: 'INDICATOR',
                    },
                ],
                rows: [],
                filters: [],
            })
        ).toBe(undefined)
    })

    it('sorts the edi objects by id before generating the hash to optimize caching', () => {
        expect(
            getExpressionHashFromVisualization({
                columns: [
                    {
                        dimension: 'dx',
                        items: [edi1, edi2],
                    },
                ],
                rows: [],
                filters: [],
            })
        ).toBe(
            getExpressionHashFromVisualization({
                columns: [
                    {
                        dimension: 'dx',
                        items: [edi2, edi1],
                    },
                ],
                rows: [],
                filters: [],
            })
        )
    })
})
