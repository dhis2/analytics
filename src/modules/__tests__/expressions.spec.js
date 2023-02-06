import { validateExpression, INVALID_EXPRESSION } from '../expressions.js'

const invalidTestExpressions = [
    { exp: '', message: 'Empty formula' },
    { exp: '5+-', message: 'Consecutive math operators' },
    {
        exp: '#{cYeuwXTCPkU}#{Jtf34kNZhzP}',
        message: 'Consecutive data elements',
    },
    {
        exp: '*((#{cYeuwXTCPkU}*#{Jtf34kNZhzP})))',
        message: 'Starts or ends with a math operator',
    },
    {
        exp: '((#{cYeuwXTCPkU}*#{Jtf34kNZhzP})))',
        message: 'Missing left parenthesis (',
    },
    {
        exp: '((#{cYeuwXTCPkU}*#{Jtf34kNZhzP})',
        message: 'Missing right parenthesis )',
    },
]

const validTestExpressions = [
    { exp: '5+9' },
    { exp: '((#{cYeuwXTCPkU}*#{Jtf34kNZhzP}))#{iKGjnOOaPlE}' },
]

describe('expressions', () => {
    invalidTestExpressions.forEach(({ exp, message }) => {
        test(`Fails: ${message}`, () => {
            expect(validateExpression(exp)).toEqual({
                status: INVALID_EXPRESSION,
                message,
            })
        })
    })

    validTestExpressions.forEach(({ exp }) => {
        test(`Passes validation: ${exp}`, () => {
            expect(validateExpression(exp)).toEqual('')
        })
    })
})
