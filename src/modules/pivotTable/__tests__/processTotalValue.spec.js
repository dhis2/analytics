import { processTotalValue } from '../processTotalValue.js'

const field = 'test'
const tests = [
    {
        testName: 'negative value',
        value: -1,
        totalObj: {},
        field,
        expected: -1,
    },
    {
        testName: 'zero value',
        value: 0,
        totalObj: {},
        field,
        expected: 0,
    },
    {
        testName: 'positive value',
        value: 1,
        totalObj: {},
        field,
        expected: 1,
    },
    {
        testName: 'null value',
        value: null,
        totalObj: {},
        field,
        expected: undefined,
    },
    {
        testName: 'undefined value',
        value: undefined,
        totalObj: {},
        field,
        expected: undefined,
    },
    {
        testName: 'string value',
        value: 'string',
        totalObj: {},
        field,
        expected: undefined,
    },
    {
        testName: 'negative value with existing total',
        value: -1,
        totalObj: { [field]: 100 },
        field,
        expected: 99,
    },
    {
        testName: 'zero value with existing total',
        value: 0,
        totalObj: { [field]: 100 },
        field,
        expected: 100,
    },
    {
        testName: 'positive value with existing total',
        value: 1,
        totalObj: { [field]: 100 },
        field,
        expected: 101,
    },
    {
        testName: 'null value with existing total',
        value: null,
        totalObj: { [field]: 100 },
        field,
        expected: 100,
    },
    {
        testName: 'undefined value with existing total',
        value: undefined,
        totalObj: { [field]: 100 },
        field,
        expected: 100,
    },
    {
        testName: 'string value with existing total',
        value: 'string',
        totalObj: { [field]: 100 },
        field,
        expected: 100,
    },
]

describe('processTotalValue', () => {
    tests.forEach((t) => {
        it(t.testName, () => {
            processTotalValue(t.value, t.totalObj, t.field)
            expect(t.totalObj[field]).toEqual(t.expected)
        })
    })
})
