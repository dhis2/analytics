import {
    getAssignedOrgUnitLevels,
    addAssignedOrgUnitLevels,
} from '../assignedOrgUnitLevels.js'

const source = (id, assignedOrgUnitCounts) => ({
    dataSet: id && { id, periodType: 'Monthly' },
    elements: [],
    reportingRate: false,
    ...(assignedOrgUnitCounts && { assignedOrgUnitCounts }),
})

describe('getAssignedOrgUnitLevels', () => {
    it('gives the levels assigned, deepest first, and the deepest', () => {
        expect(
            getAssignedOrgUnitLevels([source('formA', { 1: 1, 2: 0, 4: 1159 })])
        ).toEqual({ levels: [4, 1], deepestLevel: 4, hasSeveral: false })
    })

    it('has several when data sets are assigned at different deepest levels', () => {
        expect(
            getAssignedOrgUnitLevels([
                source('formA', { 4: 10 }),
                source('formB', { 2: 3 }),
            ])
        ).toEqual({ levels: [4, 2], deepestLevel: 4, hasSeveral: true })
    })

    it('has no level without assignments', () => {
        expect(
            getAssignedOrgUnitLevels([source('formA', {}), source(null)])
        ).toEqual({
            levels: [],
            deepestLevel: null,
            hasSeveral: false,
        })
    })
})

describe('addAssignedOrgUnitLevels', () => {
    it('gives each source its counts, and the profile its assigned org unit levels', () => {
        const profile = {
            sources: [source('formA'), source(null)],
            unknown: false,
            reasons: [],
            assignedPeriodTypes: { types: ['Monthly'] },
        }

        expect(addAssignedOrgUnitLevels(profile, { formA: { 4: 2 } })).toEqual({
            ...profile,
            sources: [source('formA', { 4: 2 }), source(null)],
            assignedOrgUnitLevels: {
                levels: [4],
                deepestLevel: 4,
                hasSeveral: false,
            },
        })
        expect(
            addAssignedOrgUnitLevels(profile, {}).sources[0]
                .assignedOrgUnitCounts
        ).toEqual({})
    })

    it('gives no levels to a program indicator placed anywhere', () => {
        const placedAnywhere = {
            dataSet: null,
            program: { id: 'programAAA' },
            orgUnitField: 'REGISTRATION',
            elements: [],
            reportingRate: false,
        }

        expect(
            addAssignedOrgUnitLevels(
                { sources: [placedAnywhere] },
                { programAAA: { 4: 2 } }
            )
        ).toEqual({
            sources: [placedAnywhere],
            assignedOrgUnitLevels: {
                levels: [],
                deepestLevel: null,
                hasSeveral: false,
            },
        })
    })
})
