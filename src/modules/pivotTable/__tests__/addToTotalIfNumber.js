import { addToTotalIfNumber } from '../addToTotalIfNumber.js'

const tests = [
    {
        testName: 'negative value',
        value: -1,
        total: undefined,
        expected: -1,
    },
    {
        testName: 'zero value',
        value: 0,
        total: undefined,
        expected: 0,
    },
    {
        testName: 'positive value',
        value: 1,
        total: undefined,
        expected: 1,
    },
    {
        testName: 'null value',
        value: null,
        total: undefined,
        expected: undefined,
    },
    {
        testName: 'undefined value',
        value: undefined,
        total: undefined,
        expected: undefined,
    },
    {
        testName: 'string value',
        value: 'string',
        total: undefined,
        expected: undefined,
    },
    {
        testName: 'negative value with existing total',
        value: -1,
        total: 100,
        expected: 99,
    },
    {
        testName: 'zero value with existing total',
        value: 0,
        total: 100,
        expected: 100,
    },
    {
        testName: 'positive value with existing total',
        value: 1,
        total: 100,
        expected: 101,
    },
    {
        testName: 'null value with existing total',
        value: null,
        total: 100,
        expected: 100,
    },
    {
        testName: 'undefined value with existing total',
        value: undefined,
        total: 100,
        expected: 100,
    },
    {
        testName: 'string value with existing total',
        value: 'string',
        total: 100,
        expected: 100,
    },
]

describe('addToTotalIfNumber', () => {
    tests.forEach((t) => {
        it(t.testName, () => {
            expect(addToTotalIfNumber(t.value, t.total)).toEqual(t.expected)
        })
    })
})
