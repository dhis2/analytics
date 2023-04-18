import {
    validateExpression,
    parseArrayToExpression,
    parseExpressionToArray,
    EXPRESSION_TYPE_DATA,
    EXPRESSION_TYPE_NUMBER,
    EXPRESSION_TYPE_OPERATOR,
    INVALID_EXPRESSION,
    getItemIdsFromExpression,
} from '../expressions.js'

const invalidTestExpressions = [
    {
        message:
            'Formula is empty. Add items to the formula from the lists on the left.',
        expressions: [''],
    },
    // {
    //     message: 'Consecutive math operators',
    //     expressions: ['5+-', '5+++', '4+9-*', '5++9'],
    // },
    {
        message: 'Consecutive data elements',
        expressions: ['#{cYeuwXTCPkU}#{Jtf34kNZhzP}'],
    },
    {
        message: 'Starts or ends with a math operator',
        expressions: ['+', '+1', '1-2/', '*((#{cYeuwXTCPkU}*#{Jtf34kNZhzP})))'],
    },
    {
        message: 'Empty parentheses',
        expressions: ['#{cYeuwXTCPkU}*()'],
    },
    {
        message: 'Missing left parenthesis (',
        expressions: [
            ')',
            '5)',
            '((#{cYeuwXTCPkU}*#{P3jJH5Tu5VC.S34ULMcHMca})))',
        ],
    },
    {
        message: 'Missing right parenthesis )',
        expressions: ['(', '(5', '((#{cYeuwXTCPkU}*#{Jtf34kNZhzP})'],
    },
]

const validTestExpressions = [
    '5+9',
    '((#{cYeuwXTCPkU}*#{Jtf34kNZhzP}))#{iKGjnOOaPlE}',
    '#{P3jJH5Tu5VC.S34ULMcHMca}*#{Jtf34kNZhzP}',
    '(5)+9',
    '(5+9)',
    '10/-5',
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
    test('exp 1', () => {
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

describe('getItemIdsFromExpression', () => {
    test('exp 1', () => {
        const expression = '#{abc123}/10*99'
        const expected = ['abc123']

        expect(getItemIdsFromExpression(expression)).toEqual(expected)
    })

    test('exp 2', () => {
        const expression = '#{abc123}/10*#{def456}'
        const expected = ['abc123', 'def456']

        expect(getItemIdsFromExpression(expression)).toEqual(expected)
    })

    test('exp 3', () => {
        const expression = '#{abc123}/10*#{def456.xyz999}'
        const expected = ['abc123', 'def456.xyz999']

        expect(getItemIdsFromExpression(expression)).toEqual(expected)
    })

    test('exp 4', () => {
        const expression = '#{abc123}/10*#{def456.xyz999}+#{ghi789}'
        const expected = ['abc123', 'def456.xyz999', 'ghi789']

        expect(getItemIdsFromExpression(expression)).toEqual(expected)
    })

    test('exp 5', () => {
        const expression = '#{abc123}/10*#{def456.xyz999}+#{ghi789}+#{jkl000}'
        const expected = ['abc123', 'def456.xyz999', 'ghi789', 'jkl000']

        expect(getItemIdsFromExpression(expression)).toEqual(expected)
    })

    test('exp 6', () => {
        const expression = '5/10'
        const expected = []

        expect(getItemIdsFromExpression(expression)).toEqual(expected)
    })

    test('exp 6', () => {
        const expected = []

        expect(getItemIdsFromExpression()).toEqual(expected)
    })
})
