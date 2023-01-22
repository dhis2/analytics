import { parseExpression } from '../expressions.js'

test('matches numbers and operators', () => {
    expect(parseExpression('1+2-3*4/5')).toEqual([
        '1',
        '+',
        '2',
        '-',
        '3',
        '*',
        '4',
        '/',
        '5',
    ])
})

test('matches #{} with letters, numbers and operators', () => {
    expect(parseExpression('#{abc123}+100-200*300/400')).toEqual([
        '#{abc123}',
        '+',
        '100',
        '-',
        '200',
        '*',
        '300',
        '/',
        '400',
    ])
})

test('matches numbers and operators with brackets', () => {
    expect(parseExpression('1+(2-3)*4/5')).toEqual([
        '1',
        '+',
        '(',
        '2',
        '-',
        '3',
        ')',
        '*',
        '4',
        '/',
        '5',
    ])
})

test('matches #{} with letters, numbers and operators with brackets', () => {
    expect(parseExpression('(100-200)+#{abc123}*300/400')).toEqual([
        '(',
        '100',
        '-',
        '200',
        ')',
        '+',
        '#{abc123}',
        '*',
        '300',
        '/',
        '400',
    ])
})

test('matches #{} with numbers and operators with brackets', () => {
    expect(parseExpression('#{123}+(10-200)*3000/40000')).toEqual([
        '#{123}',
        '+',
        '(',
        '10',
        '-',
        '200',
        ')',
        '*',
        '3000',
        '/',
        '40000',
    ])
})

test('matches #{} with letters and numbers only', () => {
    expect(parseExpression('#{abc123}')).toEqual(['#{abc123}'])
})

test('matches #{} with numbers only', () => {
    expect(parseExpression('#{123}')).toEqual(['#{123}'])
})

test('matches #{} with letters only', () => {
    expect(parseExpression('#{abc}')).toEqual(['#{abc}'])
})

test('matches #{} with no input', () => {
    expect(parseExpression('')).toEqual([])
})

test('matches multiple #{} with operators', () => {
    expect(parseExpression('#{abc123}+#{def456}')).toEqual([
        '#{abc123}',
        '+',
        '#{def456}',
    ])
})

test('matches multiple #{} with operators with brackets', () => {
    expect(parseExpression('(#{abc123}/#{def456})*#{ghi789}')).toEqual([
        '(',
        '#{abc123}',
        '/',
        '#{def456}',
        ')',
        '*',
        '#{ghi789}',
    ])
})
