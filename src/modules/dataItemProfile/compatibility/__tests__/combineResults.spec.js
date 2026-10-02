import {
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

        it('says nothing more for a single operand, or a full result', () => {
            expect(combineOperandResults([none(['PERIOD_TOO_SHORT'])])).toEqual(
                none(['PERIOD_TOO_SHORT'])
            )
            expect(combineOperandResults([full(), full()])).toEqual(full())
        })
    })
})
