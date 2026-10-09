import {
    getCategoryOptionComboId,
    parseExpressionOperands,
} from '../expressionOperands.js'

const summarize = (expression) =>
    parseExpressionOperands(expression).map(
        ({ type, id, operand, aggregationType }) => ({
            type,
            ...(id !== undefined && { id }),
            ...(operand && { operand }),
            ...(aggregationType && { aggregationType }),
        })
    )

describe('parseExpressionOperands', () => {
    it.each([
        ['#{deA}', [{ type: 'DATA_ELEMENT', id: 'deA' }]],
        [
            '#{deA.cocA}',
            [{ type: 'DATA_ELEMENT', id: 'deA', operand: 'deA.cocA' }],
        ],
        [
            '#{deA.cocA.aocA}',
            [{ type: 'DATA_ELEMENT', id: 'deA', operand: 'deA.cocA.aocA' }],
        ],
        ['#{deA.*}', [{ type: 'DATA_ELEMENT', id: 'deA' }]],
        ['R{dsA.REPORTING_RATE}', [{ type: 'REPORTING_RATE', id: 'dsA' }]],
        ['N{indA}', [{ type: 'INDICATOR', id: 'indA' }]],
        ['I{piA}', [{ type: 'PROGRAM_INDICATOR', id: 'piA' }]],
        ['D{prA.deA}', [{ type: 'PROGRAM_DATA_ELEMENT', id: 'prA.deA' }]],
        ['A{prA.atA}', [{ type: 'PROGRAM_ATTRIBUTE', id: 'prA.atA' }]],
        ['C{cA}', [{ type: 'CONSTANT', id: 'cA' }]],
        ['OUG{ougA}', [{ type: 'ORG_UNIT_GROUP', id: 'ougA' }]],
        ['[days]', [{ type: 'DAYS' }]],
        ['S{subA}', [{ type: 'UNKNOWN', id: 'subA' }]],
    ])('reads %s', (expression, expected) => {
        expect(summarize(expression)).toEqual(expected)
    })

    it('reads every operand of an expression, in order', () => {
        expect(
            summarize(
                '(#{deA.cocA} + #{deB}) * C{cA} / [days] - R{dsA.ACTUAL_REPORTS}'
            )
        ).toEqual([
            { type: 'DATA_ELEMENT', id: 'deA', operand: 'deA.cocA' },
            { type: 'DATA_ELEMENT', id: 'deB' },
            { type: 'CONSTANT', id: 'cA' },
            { type: 'DAYS' },
            { type: 'REPORTING_RATE', id: 'dsA' },
        ])
    })

    it('reads the functions chained after an operand', () => {
        const [operand] = parseExpressionOperands(
            '#{deA}.periodOffset(-1).aggregationType( LAST )'
        )

        expect(operand.functions).toEqual([
            { name: 'periodOffset', arg: '-1' },
            { name: 'aggregationType', arg: 'LAST' },
        ])
        expect(operand.aggregationType).toBe('LAST')
    })

    it('reads nothing from an empty expression', () => {
        expect(parseExpressionOperands()).toEqual([])
        expect(parseExpressionOperands(null)).toEqual([])
        expect(parseExpressionOperands('1 + 2')).toEqual([])
    })
})

describe('getCategoryOptionComboId', () => {
    it('reads the option combo of a disaggregation', () => {
        expect(getCategoryOptionComboId('de.coc')).toBe('coc')
        expect(getCategoryOptionComboId('de.coc.aoc')).toBe('coc')
        expect(getCategoryOptionComboId('de.*.aoc')).toBeUndefined()
        expect(getCategoryOptionComboId('de')).toBeUndefined()
        expect(getCategoryOptionComboId(undefined)).toBeUndefined()
    })
})
