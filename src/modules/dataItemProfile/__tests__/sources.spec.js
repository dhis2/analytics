import {
    canBeAtAnyOrgUnit,
    getAssignmentField,
    getItemOperands,
    getSourceId,
    isProgramSource,
    usesProgramOrgUnits,
} from '../sources.js'

const dataSetSource = (id, elements = [], reportingRate = false) => ({
    dataSet: { id, periodType: 'Monthly' },
    elements,
    reportingRate,
})
const programSource = (id, extra = {}) => ({
    dataSet: null,
    program: { id },
    elements: [],
    reportingRate: false,
    ...extra,
})
const unassignedSource = (elements) => ({
    dataSet: null,
    elements,
    reportingRate: false,
})
const element = (id, aggregationType = 'SUM') => ({ id, aggregationType })

describe('sources', () => {
    it('tells a program from a data set or an element in no data set', () => {
        expect(isProgramSource(programSource('programAAA'))).toBe(true)
        expect(isProgramSource(dataSetSource('dataSetAAA'))).toBe(false)
        expect(isProgramSource(unassignedSource([]))).toBe(false)
    })

    it('gives the id of the data set or program, or null', () => {
        expect(getSourceId(dataSetSource('dataSetAAA'))).toBe('dataSetAAA')
        expect(getSourceId(programSource('programAAA'))).toBe('programAAA')
        expect(getSourceId(unassignedSource([]))).toBeNull()
    })

    it('gives the org unit field that lists where a source is assigned', () => {
        expect(getAssignmentField(dataSetSource('dataSetAAA'))).toBe('dataSets')
        expect(getAssignmentField(programSource('programAAA'))).toBe('programs')
    })

    it.each([
        undefined,
        'EVENT',
        'ENROLLMENT',
        'OWNER_AT_START',
        'OWNER_AT_END',
    ])(
        'places values where the program is assigned with orgUnitField %s',
        (orgUnitField) => {
            expect(usesProgramOrgUnits(orgUnitField)).toBe(true)
            expect(
                canBeAtAnyOrgUnit(programSource('p', { orgUnitField }))
            ).toBe(false)
        }
    )

    it.each(['REGISTRATION', 'orgUnitDeAA'])(
        'places values at any org unit with orgUnitField %s',
        (orgUnitField) => {
            expect(usesProgramOrgUnits(orgUnitField)).toBe(false)
            expect(
                canBeAtAnyOrgUnit(programSource('p', { orgUnitField }))
            ).toBe(true)
        }
    )

    describe('getItemOperands', () => {
        it('groups an element over the sources it is in', () => {
            const monthly = dataSetSource('monthlyForm', [element('elementA')])
            const weekly = dataSetSource('weeklyForm', [element('elementA')])

            expect(getItemOperands({ sources: [monthly, weekly] })).toEqual([
                { element: element('elementA'), sources: [monthly, weekly] },
            ])
        })

        it('keeps an element with another aggregation type apart', () => {
            const source = dataSetSource('monthlyForm', [
                element('elementA'),
                element('elementA', 'LAST'),
            ])

            expect(getItemOperands({ sources: [source] })).toHaveLength(2)
        })

        it('adds each reporting rate and each program as an operand', () => {
            const rate = dataSetSource('monthlyForm', [], true)
            const program = programSource('programAAA')

            expect(getItemOperands({ sources: [rate, program] })).toEqual([
                { reportingRate: true, sources: [rate] },
                { program: true, sources: [program] },
            ])
        })

        it('has no operand without sources', () => {
            expect(getItemOperands({ sources: [] })).toEqual([])
        })
    })
})
