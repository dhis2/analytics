import {
    validateExpression,
    parseArrayToExpression,
    parseExpressionToArray,
    EXPRESSION_TYPE_DATA,
    EXPRESSION_TYPE_NUMBER,
    EXPRESSION_TYPE_OPERATOR,
    INVALID_EXPRESSION,
} from '../expressions.js'

const invalidTestExpressions = [
    {
        message:
            'Formula is empty. Add items to the formula from the lists on the left.',
        expressions: [''],
    },
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
        expressions: ['((#{cYeuwXTCPkU}*#{P3jJH5Tu5VC.S34ULMcHMca})))'],
    },
    {
        message: 'Missing right parenthesis )',
        expressions: ['((#{cYeuwXTCPkU}*#{Jtf34kNZhzP})'],
    },
]

const validTestExpressions = [
    '5+9',
    '((#{cYeuwXTCPkU}*#{Jtf34kNZhzP}))#{iKGjnOOaPlE}',
    '#{P3jJH5Tu5VC.S34ULMcHMca}*#{Jtf34kNZhzP}',
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
            expect(validateExpression(exp)).toEqual(undefined)
        })
    })
})

describe('parseArrayToExpression', () => {
    test('expression 1', () => {
        const expressionArray = [
            {
                label: 'abc123',
                value: '#{abc123}',
                type: EXPRESSION_TYPE_DATA,
            },
            { label: '+', value: '+', type: EXPRESSION_TYPE_OPERATOR },
            {
                label: 'def456.xyz999',
                value: '#{def456.xyz999}',
                type: EXPRESSION_TYPE_DATA,
            },
            { label: '/', value: '/', type: EXPRESSION_TYPE_OPERATOR },
            { label: '10', value: '10', type: EXPRESSION_TYPE_NUMBER },
        ]
        const expected = '#{abc123}+#{def456.xyz999}/10'

        expect(parseArrayToExpression(expressionArray)).toEqual(expected)
    })
})

describe('parseExpressionToArray', () => {
    test('exp 1', () => {
        const expression = '#{abc123}/10*99'
        const expected = [
            {
                label: 'abc123',
                value: '#{abc123}',
                type: EXPRESSION_TYPE_DATA,
            },
            { label: '/', value: '/', type: EXPRESSION_TYPE_OPERATOR },
            { label: '10', value: '10', type: EXPRESSION_TYPE_NUMBER },
            { label: '×', value: '*', type: EXPRESSION_TYPE_OPERATOR },
            { label: '99', value: '99', type: EXPRESSION_TYPE_NUMBER },
        ]

        expect(parseExpressionToArray(expression)).toEqual(expected)
    })
})
