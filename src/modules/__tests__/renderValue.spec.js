import {
    NUMBER_TYPE_ROW_PERCENTAGE,
    NUMBER_TYPE_COLUMN_PERCENTAGE,
} from '../pivotTable/pivotTableConstants.js'
import { renderValue } from '../renderValue.js'
import {
    VALUE_TYPE_NUMBER,
    VALUE_TYPE_INTEGER,
    VALUE_TYPE_INTEGER_POSITIVE,
    VALUE_TYPE_INTEGER_NEGATIVE,
    VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE,
    VALUE_TYPE_PERCENTAGE,
    VALUE_TYPE_UNIT_INTERVAL,
    VALUE_TYPE_TEXT,
} from '../valueTypes.js'

const DGS_COMMA = 'COMMA'
const DGS_SPACE = 'SPACE'
const DGS_NONE = 'NONE'

const tests = [
    // Numbers
    {
        value: 1000.5,
        expected: '1 000.5',
        valueType: VALUE_TYPE_NUMBER,
        round: true,
        dgs: DGS_SPACE,
    },
    {
        value: 33777889.55,
        expected: '33,777,889.5',
        valueType: VALUE_TYPE_NUMBER,
        round: true,
        dgs: DGS_COMMA,
    },
    {
        value: 33777889.556,
        expected: '33 777 889.6',
        valueType: VALUE_TYPE_NUMBER,
        round: true,
        dgs: DGS_SPACE,
    },
    {
        value: 33777889.556,
        expected: '33 777 889.5560000017', // float issue?
        valueType: VALUE_TYPE_NUMBER,
        round: false,
        dgs: DGS_SPACE,
    },
    {
        value: 33777889.56,
        expected: '33777889.6',
        valueType: VALUE_TYPE_NUMBER,
        round: true,
        dgs: DGS_NONE,
    },
    {
        value: 0.0005,
        expected: '0',
        valueType: VALUE_TYPE_NUMBER,
        round: true,
        dgs: DGS_SPACE,
    },
    {
        value: 0.109,
        expected: '0.11',
        valueType: VALUE_TYPE_NUMBER,
        round: true,
        dgs: DGS_SPACE,
    },
    {
        value: 1.101,
        expected: '1.1',
        valueType: VALUE_TYPE_NUMBER,
        round: true,
        dgs: DGS_SPACE,
    },
    {
        value: 1.101,
        expected: '1.1010000000',
        valueType: VALUE_TYPE_NUMBER,
        round: false,
        dgs: DGS_SPACE,
    },
    {
        value: 0.0005,
        expected: '0.0005000000',
        valueType: VALUE_TYPE_NUMBER,
        round: false,
        dgs: DGS_SPACE,
    },
    // Numbers showing as column/row percentage
    {
        value: 0.234,
        expected: '23.4%',
        valueType: VALUE_TYPE_NUMBER,
        numberType: NUMBER_TYPE_ROW_PERCENTAGE,
        round: true,
        dgs: DGS_SPACE,
    },
    {
        value: 0.234,
        expected: '23.4%',
        valueType: VALUE_TYPE_NUMBER,
        numberType: NUMBER_TYPE_ROW_PERCENTAGE,
        round: false,
        dgs: DGS_SPACE,
    },
    {
        value: 0.000234,
        expected: '0.02%',
        valueType: VALUE_TYPE_NUMBER,
        numberType: NUMBER_TYPE_ROW_PERCENTAGE,
        round: true,
        dgs: DGS_SPACE,
    },
    {
        value: 0.0000432,
        expected: '0%',
        valueType: VALUE_TYPE_NUMBER,
        numberType: NUMBER_TYPE_ROW_PERCENTAGE,
        round: true,
        dgs: DGS_SPACE,
    },
    {
        value: 0.000234,
        expected: '0.0234%',
        valueType: VALUE_TYPE_NUMBER,
        numberType: NUMBER_TYPE_ROW_PERCENTAGE,
        round: false,
        dgs: DGS_SPACE,
    },
    {
        value: -0.0234,
        expected: '-2.3%',
        valueType: VALUE_TYPE_NUMBER,
        numberType: NUMBER_TYPE_ROW_PERCENTAGE,
        round: true,
        dgs: DGS_SPACE,
    },
    {
        value: -0.0234,
        expected: '-2.34%',
        valueType: VALUE_TYPE_NUMBER,
        numberType: NUMBER_TYPE_ROW_PERCENTAGE,
        round: false,
        dgs: DGS_SPACE,
    },
    {
        value: 0.450048675309,
        expected: '45.0048675309%',
        valueType: VALUE_TYPE_NUMBER,
        numberType: NUMBER_TYPE_ROW_PERCENTAGE,
        round: false,
        dgs: DGS_SPACE,
    },
    {
        value: 77.893,
        expected: '7 789.3%',
        valueType: VALUE_TYPE_NUMBER,
        numberType: NUMBER_TYPE_COLUMN_PERCENTAGE,
        round: true,
        dgs: DGS_SPACE,
    },
    {
        value: 77.893,
        expected: '7,789.3%',
        valueType: VALUE_TYPE_NUMBER,
        numberType: NUMBER_TYPE_COLUMN_PERCENTAGE,
        round: true,
        dgs: DGS_COMMA,
    },
    // Integers
    {
        value: 99777888,
        expected: '99 777 888',
        valueType: VALUE_TYPE_INTEGER,
        round: true,
        dgs: DGS_SPACE,
    },
    {
        value: -99777888,
        expected: '-99 777 888',
        valueType: VALUE_TYPE_INTEGER,
        round: true,
        dgs: DGS_SPACE,
    },
    {
        value: -9977888,
        expected: '-9977888',
        valueType: VALUE_TYPE_INTEGER,
        round: true,
        dgs: DGS_NONE,
    },
    {
        value: 345,
        expected: '345',
        valueType: VALUE_TYPE_INTEGER_POSITIVE,
        round: true,
        dgs: DGS_COMMA,
    },
    {
        value: 334445577,
        expected: '334,445,577',
        valueType: VALUE_TYPE_INTEGER_POSITIVE,
        round: false,
        dgs: DGS_COMMA,
    },
    {
        value: -44555777,
        expected: '-44 555 777',
        valueType: VALUE_TYPE_INTEGER_NEGATIVE,
        round: true,
        dgs: DGS_SPACE,
    },
    {
        value: -4445577,
        expected: '-4,445,577',
        valueType: VALUE_TYPE_INTEGER_NEGATIVE,
        round: false,
        dgs: DGS_COMMA,
    },
    {
        value: -445577,
        expected: '-445577',
        valueType: VALUE_TYPE_INTEGER_NEGATIVE,
        round: true,
        dgs: DGS_NONE,
    },
    {
        value: -4445577,
        expected: '-4,445,577',
        valueType: VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE,
        round: false,
        dgs: DGS_COMMA,
    },
    {
        value: 57,
        expected: '5 700%',
        valueType: VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE,
        numberType: NUMBER_TYPE_COLUMN_PERCENTAGE,
        round: true,
        dgs: DGS_SPACE,
    },
    {
        value: 557,
        expected: '55700%',
        valueType: VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE,
        numberType: NUMBER_TYPE_COLUMN_PERCENTAGE,
        round: true,
        dgs: DGS_NONE,
    },
    // Percentage
    {
        value: 5,
        expected: '5',
        valueType: VALUE_TYPE_PERCENTAGE,
        round: true,
        dgs: DGS_SPACE,
    },
    {
        value: 53,
        expected: '53',
        valueType: VALUE_TYPE_PERCENTAGE,
        round: false,
        dgs: DGS_SPACE,
    },
    {
        value: 53,
        expected: '5 300%',
        valueType: VALUE_TYPE_PERCENTAGE,
        numberType: NUMBER_TYPE_COLUMN_PERCENTAGE,
        round: true,
        dgs: DGS_SPACE,
    },

    // Unit interval
    {
        value: 4,
        expected: '4',
        valueType: VALUE_TYPE_UNIT_INTERVAL,
        round: true,
        dgs: DGS_COMMA,
    },
    {
        value: 4600,
        expected: '4 600',
        valueType: VALUE_TYPE_UNIT_INTERVAL,
        round: false,
        dgs: DGS_SPACE,
    },
    {
        value: 46,
        expected: '4,600%',
        valueType: VALUE_TYPE_UNIT_INTERVAL,
        numberType: NUMBER_TYPE_COLUMN_PERCENTAGE,
        round: true,
        dgs: DGS_COMMA,
    },

    // Texts
    {
        value: 'This    string has multiple whitespace     characters',
        expected: 'This string has multiple whitespace     characters',
        valueType: VALUE_TYPE_TEXT,
    },
    {
        value: 'Characters          \n',
        expected: 'Characters \n',
        valueType: VALUE_TYPE_TEXT,
    },
    {
        value: 'Characters          \nmorecharacters   here',
        expected: 'Characters \nmorecharacters   here',
        valueType: VALUE_TYPE_TEXT,
    },
    // Undefined values
    {
        value: undefined,
        expected: 'undefined',
        valueType: VALUE_TYPE_NUMBER,
    },
    {
        value: undefined,
        expected: 'undefined',
        valueType: VALUE_TYPE_TEXT,
    },
]

describe('renderValue', () => {
    tests.forEach((t) => {
        const testname = `valueType: ${t.valueType}, value: ${t.value}, dgs: ${
            t.dgs
        }, round: ${t.round}, isPercent: ${[
            NUMBER_TYPE_ROW_PERCENTAGE,
            NUMBER_TYPE_COLUMN_PERCENTAGE,
        ].includes(t.numberType)}`

        it(testname, () => {
            const actual = renderValue(t.value, t.valueType, {
                skipRounding: !t.round,
                digitGroupSeparator: t.dgs,
                numberType: t.numberType,
            })
            expect(actual).toEqual(t.expected)
        })
    })
})
