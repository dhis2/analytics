import {
    combineAddedUpResults,
    combineExpressionResults,
    combineOperandResults,
    combineResults,
    createResult,
    getMostSevere,
    getUnknownResult,
    unionOfReasons,
} from '../combineResults.js'

const full = (reasons) => createResult('full', reasons)
const partial = (reasons) => createResult('partial', reasons)
const none = (reasons) => createResult('none', reasons)

describe('combineResults', () => {
    it('creates a result with no reason by default', () => {
        expect(createResult('full')).toEqual({ status: 'full', reasons: [] })
        expect(getUnknownResult('UNKNOWN_PERIOD')).toEqual({
            status: 'unknown',
            reasons: ['UNKNOWN_PERIOD'],
        })
    })

    it('lists every reason once, in the reason order', () => {
        expect(
            unionOfReasons([
                full(['REPEATED_VALUE']),
                none(['PERIOD_TOO_SHORT', 'REPEATED_VALUE']),
            ])
        ).toEqual(['PERIOD_TOO_SHORT', 'REPEATED_VALUE'])
    })

    it('picks the most severe result: none, partial, unknown, full', () => {
        const unknown = getUnknownResult('UNKNOWN_PERIOD')

        expect(getMostSevere([full(), unknown, partial()])).toEqual(partial())
        expect(getMostSevere([full(), unknown])).toBe(unknown)
        expect(getMostSevere([])).toBeUndefined()
    })

    it('combines into the most severe status with every reason', () => {
        expect(
            combineResults([
                full(['REPEATED_VALUE']),
                none(['PERIOD_TOO_SHORT']),
            ])
        ).toEqual(none(['PERIOD_TOO_SHORT', 'REPEATED_VALUE']))
        expect(combineResults([])).toEqual(full())
    })

    describe('combineAddedUpResults', () => {
        it('is none when all are, partial when some are none or partial', () => {
            expect(
                combineAddedUpResults([
                    none(['PERIOD_TOO_SHORT']),
                    none(['NO_EARLIER_PERIOD_VALUE']),
                ])
            ).toEqual(none(['PERIOD_TOO_SHORT', 'NO_EARLIER_PERIOD_VALUE']))
            expect(
                combineAddedUpResults([full(), none(['PERIOD_TOO_SHORT'])])
            ).toEqual(partial(['PERIOD_TOO_SHORT']))
            expect(
                combineAddedUpResults([full(), partial(['OPERAND_PARTIAL'])])
            ).toEqual(partial(['OPERAND_PARTIAL']))
        })

        it('is unknown when the results without none are all unknown', () => {
            expect(
                combineAddedUpResults([
                    none(['PERIOD_TOO_SHORT']),
                    getUnknownResult('UNKNOWN_PERIOD'),
                ])
            ).toEqual(
                createResult('unknown', ['PERIOD_TOO_SHORT', 'UNKNOWN_PERIOD'])
            )
            expect(
                combineAddedUpResults([
                    full(),
                    none(['PERIOD_TOO_SHORT']),
                    getUnknownResult('UNKNOWN_PERIOD'),
                ])
            ).toEqual(partial(['PERIOD_TOO_SHORT', 'UNKNOWN_PERIOD']))
        })

        it('is otherwise the most severe of the rest, and full for none', () => {
            expect(
                combineAddedUpResults([
                    full(),
                    getUnknownResult('UNSUPPORTED_VERSION'),
                ])
            ).toEqual(getUnknownResult('UNSUPPORTED_VERSION'))
            expect(combineAddedUpResults([])).toEqual(full())
        })
    })

    describe('combineOperandResults', () => {
        it('says first when an operand of an expression gives none or leaves values out', () => {
            expect(
                combineOperandResults([full(), none(['PERIOD_TOO_SHORT'])])
            ).toEqual(none(['OPERAND_EMPTY', 'PERIOD_TOO_SHORT']))
            expect(
                combineOperandResults([
                    full(),
                    partial(['PERIOD_TYPE_MISMATCH']),
                ])
            ).toEqual(partial(['OPERAND_PARTIAL', 'PERIOD_TYPE_MISMATCH']))
        })

        it('adds operands up when a missing value counts as 0', () => {
            expect(
                combineOperandResults(
                    [full(), none(['PERIOD_TOO_SHORT'])],
                    'SKIP_IF_ALL_VALUES_MISSING'
                )
            ).toEqual(partial(['OPERAND_EMPTY', 'PERIOD_TOO_SHORT']))
            expect(
                combineOperandResults(
                    [none(['PERIOD_TOO_SHORT']), partial(['REPEATED_VALUE'])],
                    'NEVER_SKIP'
                )
            ).toEqual(
                partial([
                    'OPERAND_EMPTY',
                    'OPERAND_PARTIAL',
                    'PERIOD_TOO_SHORT',
                    'REPEATED_VALUE',
                ])
            )
            expect(
                combineOperandResults(
                    [none(['PERIOD_TOO_SHORT']), none(['PERIOD_TOO_SHORT'])],
                    'SKIP_IF_ALL_VALUES_MISSING'
                )
            ).toEqual(none(['OPERAND_EMPTY', 'PERIOD_TOO_SHORT']))
        })

        it('says nothing more for a single operand, or a full result', () => {
            expect(combineOperandResults([none(['PERIOD_TOO_SHORT'])])).toEqual(
                none(['PERIOD_TOO_SHORT'])
            )
            expect(combineOperandResults([full(), full()])).toEqual(full())
        })
    })

    describe('combineExpressionResults', () => {
        const results = {
            a: full(),
            b: none(['PERIOD_TOO_SHORT']),
        }
        const resultOf = (key) => results[key]

        it('needs every operand without an expression', () => {
            expect(
                combineExpressionResults(undefined, ['a', 'b'], resultOf)
            ).toEqual(none(['OPERAND_EMPTY', 'PERIOD_TOO_SHORT']))
        })

        it('combines nested parts by their strategies', () => {
            const sum = {
                missingValueStrategy: 'SKIP_IF_ALL_VALUES_MISSING',
                parts: [{ operand: 'a' }, { operand: 'b' }],
            }

            expect(combineExpressionResults(sum, [], resultOf)).toEqual(
                partial(['OPERAND_EMPTY', 'PERIOD_TOO_SHORT'])
            )
            expect(
                combineExpressionResults(
                    {
                        missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                        parts: [sum, { operand: 'b' }],
                    },
                    [],
                    resultOf
                )
            ).toEqual(none(['OPERAND_EMPTY', 'PERIOD_TOO_SHORT']))
        })

        it('leaves out parts with no operand, and is full without any', () => {
            const constants = {
                missingValueStrategy: 'SKIP_IF_ALL_VALUES_MISSING',
                parts: [],
            }

            expect(
                combineExpressionResults(
                    {
                        missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                        parts: [{ operand: 'b' }, constants],
                    },
                    [],
                    resultOf
                )
            ).toEqual(none(['PERIOD_TOO_SHORT']))
            expect(combineExpressionResults(undefined, [], resultOf)).toEqual(
                full()
            )
        })
    })
})
