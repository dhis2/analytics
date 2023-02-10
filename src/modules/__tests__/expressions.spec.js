import {
    validateExpression,
    parseArrayToExpression,
    parseExpressionToArray,
    INVALID_EXPRESSION,
} from '../expressions.js'

const invalidTestExpressions = [
    { message: 'Empty formula', expressions: [''] },
    {
        message: 'Consecutive math operators',
        expressions: ['5+-', '5+++', '4+9-*'],
    },
    {
        message: 'Consecutive data elements',
        expressions: ['#{cYeuwXTCPkU}#{Jtf34kNZhzP}'],
    },
    {
        message: 'Starts or ends with a math operator',
        expressions: ['*((#{cYeuwXTCPkU}*#{Jtf34kNZhzP})))'],
    },
    {
        message: 'Missing left parenthesis (',
        expressions: ['((#{cYeuwXTCPkU}*#{Jtf34kNZhzP})))'],
    },
    {
        message: 'Missing right parenthesis )',
        expressions: ['((#{cYeuwXTCPkU}*#{Jtf34kNZhzP})'],
    },
]

const validTestExpressions = [
    '5+9',
    '((#{cYeuwXTCPkU}*#{Jtf34kNZhzP}))#{iKGjnOOaPlE}',
]

describe('validateExpression', () => {
    invalidTestExpressions.forEach(({ expressions, message }) => {
        expressions.forEach((exp) => {
            test(`Fails: ${message}`, () => {
                expect(validateExpression(exp)).toEqual({
                    status: INVALID_EXPRESSION,
                    message,
                })
            })
        })
    })

    validTestExpressions.forEach((exp) => {
        test(`Passes validation: ${exp}`, () => {
            expect(validateExpression(exp)).toEqual('')
        })
    })
})

describe('parseArrayToExpression', () => {
    test('expression 1', () => {
        const expressionArray = [
            { label: 'abc123', value: '#{abc123}' },
            { label: '/', value: '/' },
            { label: '10', value: '10' },
        ]
        const expected = '#{abc123}/10'

        expect(parseArrayToExpression(expressionArray)).toEqual(expected)
    })
})

describe('parseExpressionToArray', () => {
    test('exp 1', () => {
        const expression = '#{abc123}/10'
        const expected = [
            { label: 'abc123', value: '#{abc123}' },
            { label: '/', value: '/' },
            { label: '10', value: '10' },
        ]

        expect(parseExpressionToArray(expression)).toEqual(expected)
    })
})
