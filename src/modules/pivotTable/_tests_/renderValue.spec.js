import {
    NUMBER_TYPE_ROW_PERCENTAGE,
    NUMBER_TYPE_COLUMN_PERCENTAGE,
    VALUE_TYPE_NUMBER,
} from '../pivotTableConstants.js'
import { renderValue } from '../renderValue.js'

const VALUE_TYPE_INTEGER_POSITIVE = 'INTEGER_POSITIVE'
const VALUE_TYPE_TEXT = 'TEXT'
const VALUE_TYPE_INTEGER = 'INTEGER'

const tests = [
    {
        value: 1000.5,
        expected: '1 000.5',
        valueType: VALUE_TYPE_NUMBER,
        visualization: {
            skipRounding: false,
            digitGroupSeparator: 'SPACE',
        },
    },
    {
        value: 0.0005,
        expected: '0',
        valueType: VALUE_TYPE_NUMBER,
        visualization: {
            skipRounding: false,
            digitGroupSeparator: 'SPACE',
        },
    },
    {
        value: 0.0005,
        expected: '0.0005000000',
        valueType: VALUE_TYPE_NUMBER,
        visualization: {
            skipRounding: true,
            digitGroupSeparator: 'SPACE',
        },
    },
    {
        value: undefined,
        expected: 'undefined',
        valueType: VALUE_TYPE_NUMBER,
        visualization: {},
    },
    {
        value: 0.234,
        expected: '23.4%',
        valueType: VALUE_TYPE_NUMBER,
        visualization: {
            skipRounding: false,
            digitGroupSeparator: 'SPACE',
            numberType: NUMBER_TYPE_ROW_PERCENTAGE,
        },
    },
    {
        value: 0.000234,
        expected: '0.02%',
        valueType: VALUE_TYPE_NUMBER,
        visualization: {
            skipRounding: false,
            digitGroupSeparator: 'SPACE',
            numberType: NUMBER_TYPE_ROW_PERCENTAGE,
        },
    },
    {
        value: 0.000234,
        expected: '0.0234%',
        valueType: VALUE_TYPE_NUMBER,
        visualization: {
            skipRounding: true,
            digitGroupSeparator: 'SPACE',
            numberType: NUMBER_TYPE_ROW_PERCENTAGE,
        },
    },
    {
        value: -0.0234,
        expected: '-2.3%',
        valueType: VALUE_TYPE_NUMBER,
        visualization: {
            skipRounding: false,
            digitGroupSeparator: 'SPACE',
            numberType: NUMBER_TYPE_ROW_PERCENTAGE,
        },
    },
    {
        value: 0.454321,
        expected: '45.4321%',
        valueType: VALUE_TYPE_NUMBER,
        visualization: {
            skipRounding: true,
            digitGroupSeparator: 'SPACE',
            numberType: NUMBER_TYPE_ROW_PERCENTAGE,
        },
    },
    {
        value: 77.89,
        expected: '7789%',
        valueType: VALUE_TYPE_NUMBER,
        visualization: {
            skipRounding: false,
            digitGroupSeparator: 'SPACE',
            numberType: NUMBER_TYPE_COLUMN_PERCENTAGE,
        },
    },
    {
        value: 99777888,
        expected: '99777888',
        valueType: VALUE_TYPE_INTEGER,
        visualization: {
            skipRounding: false,
            digitGroupSeparator: 'SPACE',
        },
    },
    {
        value: 33444555777,
        expected: '33444555777',
        valueType: VALUE_TYPE_INTEGER_POSITIVE,
        visualization: {
            skipRounding: false,
            digitGroupSeparator: 'COMMA',
        },
    },
    {
        value: 'This    string has multiple whitespace     characters',
        expected: 'This string has multiple whitespace     characters',
        valueType: VALUE_TYPE_TEXT,
        visualization: {},
    },
    {
        value: 'Characters          \n',
        expected: 'Characters \n',
        valueType: VALUE_TYPE_TEXT,
        visualization: {},
    },
    {
        value: 'Characters          \nmorecharacters   here',
        expected: 'Characters \nmorecharacters   here',
        valueType: VALUE_TYPE_TEXT,
        visualization: {},
    },
]

describe('renderValue', () => {
    tests.forEach((t) => {
        const testname = `valueType: ${t.valueType}, value: ${
            t.value
        }, dgs: ${!t.visualization.digitGroupSeparator}, round: ${!t
            .visualization.skipRounding}, isPercent: ${[
            NUMBER_TYPE_ROW_PERCENTAGE,
            NUMBER_TYPE_COLUMN_PERCENTAGE,
        ].includes(t.visualization.numberType)}`

        it(testname, () => {
            const actual = renderValue(t.value, t.valueType, t.visualization)
            expect(actual).toEqual(t.expected)
        })
    })
})
