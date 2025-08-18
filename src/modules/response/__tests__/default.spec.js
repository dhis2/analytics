import responseHideNa from '../../../__demo__/data/event/numeric.data.hidena.json'
import responseOrg from '../../../__demo__/data/event/numeric.data.org.json'
import { VALUE_TYPE_NUMBER } from '../../valueTypes.js'
import {
    applyDefaultHandler,
    getDimensions,
    getItems,
    getRows,
    getPrefixedValue,
    getUnique,
    getValuesUniqueSortedAsc,
} from '../default.js'
import { NA_VALUE, PREFIX_SEPARATOR } from '../response.js'

const testId = 'Zj7UnCAulEk.qrur9Dvnyt5'
const headerIndex = 0

describe('default', () => {
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

    describe('getValuesUniqueSortedAsc', () => {
        it('sorts string numbers numerically', () => {
            expect(
                getValuesUniqueSortedAsc(
                    ['1', '10', '-1', '5', '5', '3'],
                    VALUE_TYPE_NUMBER
                )
            ).toEqual(['-1', '1', '3', '5', '10'])
        })

        it('sorts non-numbers as strings', () => {
            expect(
                getValuesUniqueSortedAsc([
                    '1995-04-18 13:54:00.0',
                    '1991-12-03 12:02:00.0',
                    '1992-01-05 12:51:00.0',
                    '1991-05-21 14:46:00.0',
                    '1998-03-01 11:21:00.0',
                    '1991-09-02 10:21:00.0',
                    '1992-01-04 12:02:00.0',
                    '1991-12-02 12:01:00.0',
                    '1990-01-25 14:51:00.0',
                    '1991-05-22 14:47:00.0',
                ])
            ).toEqual([
                '1990-01-25 14:51:00.0',
                '1991-05-21 14:46:00.0',
                '1991-05-22 14:47:00.0',
                '1991-09-02 10:21:00.0',
                '1991-12-02 12:01:00.0',
                '1991-12-03 12:02:00.0',
                '1992-01-04 12:02:00.0',
                '1992-01-05 12:51:00.0',
                '1995-04-18 13:54:00.0',
                '1998-03-01 11:21:00.0',
            ])
        })
    })

    describe('getPrefixedValue', () => {
        it('returns prefix and value separated by a colon', () => {
            expect(getPrefixedValue('123', 'id')).toBe(
                `id${PREFIX_SEPARATOR}123`
            )
        })
    })

    describe('getNumericItems', () => {
        it('returns an object with prefixed keys and correct names', () => {
            const values = ['1', '2']

            expect(getItems(values, testId)).toEqual({
                [testId + `${PREFIX_SEPARATOR}1`]: { name: '1' },
                [testId + `${PREFIX_SEPARATOR}2`]: { name: '2' },
            })
        })
    })

    describe('getNumericDimension', () => {
        it('returns object with dimensionId as key and correctly prefixed values', () => {
            const values = ['1', '2']
            expect(getDimensions(values, testId)).toEqual({
                [testId]: [
                    testId + `${PREFIX_SEPARATOR}1`,
                    testId + `${PREFIX_SEPARATOR}2`,
                ],
            })
        })
    })

    describe('getNumericRows', () => {
        it('prefixes value at headerIndex for each row', () => {
            const rows = [
                ['a', '1', 'x'],
                ['b', '2', 'y'],
                ['c', NA_VALUE, 'z'],
            ]
            const headerIndex = 1

            expect(getRows(rows, headerIndex, testId)).toEqual([
                ['a', testId + `${PREFIX_SEPARATOR}1`, 'x'],
                ['b', testId + `${PREFIX_SEPARATOR}2`, 'y'],
                ['c', NA_VALUE, 'z'],
            ])
        })

        it('handles empty rows array', () => {
            expect(getRows([], 1, 'a')).toEqual([])
        })
    })

    describe('applyNumericHandler', () => {
        it('should return the transformed response', () => {
            expect(applyDefaultHandler(responseOrg, headerIndex)).toEqual(
                responseHideNa
            )
        })
    })
})
