import { validateExpression, INVALID_EXPRESSION } from '../expressions.js'

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
