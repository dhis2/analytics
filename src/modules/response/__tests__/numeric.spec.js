import response from '../../../__demo__/data/event/numeric.data.json'
import responseOrg from '../../../__demo__/data/event/numeric.data.org.json'
import {
    applyNumericHandler,
    getNumericDimension,
    getNumericItems,
    getNumericRows,
    getPrefixedValue,
    getUnique,
    sortStringsAsNumbersAsc,
} from '../numeric.js'

const dimensionId = 'Zj7UnCAulEk.fWIAEtYVEGk'
const headerIndex = 0

describe('numeric', () => {
    describe('getUnique', () => {
        it('removes duplicate string numbers and preserves first occurrence', () => {
            const arr = ['2', '10', '2', '01', '1', '-1', '-1', '1', '10']
            expect(getUnique(arr)).toEqual(['2', '10', '01', '1', '-1'])
        })

        it('treats "01" and "1" as different strings', () => {
            const arr = ['01', '1', '01']
            expect(getUnique(arr)).toEqual(['01', '1'])
        })

        it('returns an empty array when given an empty array', () => {
            expect(getUnique([])).toEqual([])
        })

        it('handles array with only one item', () => {
            expect(getUnique(['42'])).toEqual(['42'])
        })

        it('preserves order of first occurrence', () => {
            const arr = ['2', '1', '2', '1']
            expect(getUnique(arr)).toEqual(['2', '1'])
        })
    })

    describe('sortStringsAsNumbersAsc', () => {
        it('sorts array of number strings numerically ascending', () => {
            const arr = ['10', '2', '1']
            expect(sortStringsAsNumbersAsc(arr)).toEqual(['1', '2', '10'])
        })

        it('handles negative numbers and zeros as strings', () => {
            const arr = ['0', '-2', '5', '-10']
            expect(sortStringsAsNumbersAsc(arr)).toEqual([
                '-10',
                '-2',
                '0',
                '5',
            ])
        })

        it('sorts strings with leading zeros numerically', () => {
            const arr = ['01', '1', '002', '2']
            expect(sortStringsAsNumbersAsc(arr)).toEqual([
                '01',
                '1',
                '002',
                '2',
            ])
        })

        it('returns empty array when given empty array', () => {
            expect(sortStringsAsNumbersAsc([])).toEqual([])
        })

        it('handles array with one item', () => {
            expect(sortStringsAsNumbersAsc(['7'])).toEqual(['7'])
        })
    })

    describe('getPrefixedValue', () => {
        it('returns prefix and value separated by a colon', () => {
            expect(getPrefixedValue('123', 'id')).toBe('id:123')
        })

        it('works with empty string prefix', () => {
            expect(getPrefixedValue('abc', '')).toBe(':abc')
        })

        it('works with empty string value', () => {
            expect(getPrefixedValue('', 'test')).toBe('test:')
        })

        it('works with both prefix and value empty', () => {
            expect(getPrefixedValue('', '')).toBe(':')
        })
        it('works with numbers as value', () => {
            expect(getPrefixedValue(42, 'num')).toBe('num:42')
        })

        it('works with numbers as prefix', () => {
            expect(getPrefixedValue('data', 99)).toBe('99:data')
        })

        it('works with non-string types as both prefix and value', () => {
            expect(getPrefixedValue(null, undefined)).toBe('undefined:null')
            expect(getPrefixedValue(true, false)).toBe('false:true')
        })
    })

    describe('getNumericItems', () => {
        it('returns an object with prefixed keys and correct names', () => {
            const values = ['1', '2', '10']

            expect(getNumericItems(values, dimensionId)).toEqual({
                'Zj7UnCAulEk.fWIAEtYVEGk:1': { name: '1' },
                'Zj7UnCAulEk.fWIAEtYVEGk:2': { name: '2' },
                'Zj7UnCAulEk.fWIAEtYVEGk:10': { name: '10' },
            })
        })

        it('handles empty values array', () => {
            expect(getNumericItems([], 'prefix')).toEqual({})
        })

        it('handles empty dimensionId', () => {
            const values = ['a', 'b']
            expect(getNumericItems(values, '')).toEqual({
                ':a': { name: 'a' },
                ':b': { name: 'b' },
            })
        })

        it('works with non-string values', () => {
            const values = [1, 2, null, undefined]
            expect(getNumericItems(values, 'num')).toEqual({
                'num:1': { name: 1 },
                'num:2': { name: 2 },
                'num:null': { name: null },
                'num:undefined': { name: undefined },
            })
        })

        it('handles duplicate values, last one wins', () => {
            const values = ['1', '2', '1']
            expect(getNumericItems(values, 'x')).toEqual({
                'x:1': { name: '1' }, // Last occurrence
                'x:2': { name: '2' },
            })
        })

        it('handles numbers as dimensionId', () => {
            const values = ['42']
            expect(getNumericItems(values, 7)).toEqual({
                '7:42': { name: '42' },
            })
        })
    })

    describe('getNumericDimension', () => {
        it('returns object with dimensionId as key and correctly prefixed values', () => {
            const values = ['1', '2', '10']
            expect(getNumericDimension(values, dimensionId)).toEqual({
                'Zj7UnCAulEk.fWIAEtYVEGk': [
                    'Zj7UnCAulEk.fWIAEtYVEGk:1',
                    'Zj7UnCAulEk.fWIAEtYVEGk:2',
                    'Zj7UnCAulEk.fWIAEtYVEGk:10',
                ],
            })
        })

        it('handles empty values array', () => {
            expect(getNumericDimension([], 'prefix')).toEqual({
                prefix: [],
            })
        })

        it('handles empty string as dimensionId', () => {
            const values = ['1', '2', '10']
            expect(getNumericDimension(values, '')).toEqual({
                '': [':1', ':2', ':10'],
            })
        })
    })

    describe('getNumericRows', () => {
        it('prefixes value at headerIndex for each row', () => {
            const rows = [
                ['a', '1', 'x'],
                ['b', '2', 'y'],
                ['c', '10', 'z'],
            ]
            const headerIndex = 1

            expect(getNumericRows(rows, headerIndex, dimensionId)).toEqual([
                ['a', 'Zj7UnCAulEk.fWIAEtYVEGk:1', 'x'],
                ['b', 'Zj7UnCAulEk.fWIAEtYVEGk:2', 'y'],
                ['c', 'Zj7UnCAulEk.fWIAEtYVEGk:10', 'z'],
            ])
        })

        it('handles empty rows array', () => {
            expect(getNumericRows([], 1, 'a')).toEqual([])
        })
    })

    describe('applyNumericHandler', () => {
        it('should return the transformed response', () => {
            expect(applyNumericHandler(responseOrg, headerIndex)).toEqual(
                response
            )
        })
    })
})
