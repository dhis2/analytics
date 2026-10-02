import { createFakeOrgUnitServer } from '../../../__fixtures__/fakeOrgUnitServer.js'
import {
    fetchAssignedOrgUnitCounts,
    getCountableSources,
} from '../assignedOrgUnitCounts.js'
import { fetchOrgUnitCoverage } from '../fetchOrgUnitCoverage.js'

/* A nation with 2 districts and 3 facilities. formMonth: 2 of the 3
 * facilities, and the nation. formQuart: the districts. eventProgra: the 3
 * facilities. clinicGroup: facilityAAA and facilityCCC. mixedGroupA:
 * districtBBB and facilityAAA. */
const GROUPS = {
    clinicGroup: ['facilityAAA', 'facilityCCC'],
    mixedGroupA: ['districtBBB', 'facilityAAA'],
}

const UNITS = [
    ['nationUnit1', 1, '/nationUnit1', ['formMonth']],
    ['districtAAA', 2, '/nationUnit1/districtAAA', ['formQuart']],
    ['districtBBB', 2, '/nationUnit1/districtBBB', ['formQuart']],
    ['facilityAAA', 3, '/nationUnit1/districtAAA/facilityAAA', ['formMonth']],
    ['facilityBBB', 3, '/nationUnit1/districtAAA/facilityBBB', ['formMonth']],
    ['facilityCCC', 3, '/nationUnit1/districtBBB/facilityCCC', []],
].map(([id, level, path, dataSets]) => ({
    id,
    level,
    path,
    dataSets,
    programs: level === 3 ? ['eventProgra'] : [],
}))

const { createEngine } = createFakeOrgUnitServer({
    orgUnits: UNITS,
    groups: GROUPS,
    user: {
        organisationUnits: ['nationUnit1'],
        dataViewOrganisationUnits: ['districtAAA'],
    },
    // Out of order, as a server may list them
    levels: [3, 1, 2],
})

const dataSets = (...ids) => ids.map((id) => ({ id, field: 'dataSets' }))

const fetchFor = (orgUnits, sources = dataSets('formMonth', 'formQuart')) =>
    fetchOrgUnitCoverage(createEngine(), { sources, orgUnits })

describe('fetchOrgUnitCoverage', () => {
    it('counts the units and assignments under a unit, per level', async () => {
        const coverage = await fetchFor(['districtAAA'])

        expect(coverage.levels.map(({ level }) => level)).toEqual([1, 2, 3])
        expect(coverage.orgUnits.districtAAA).toEqual({
            id: 'districtAAA',
            level: 2,
            path: '/nationUnit1/districtAAA',
            name: undefined,
        })
        expect(coverage.assignedOrgUnitCounts).toEqual({
            formMonth: { 1: 1, 3: 2 },
            formQuart: { 2: 2 },
        })
        expect(coverage.counts.districtAAA).toEqual({
            totals: { 2: 1, 3: 2 },
            sources: {
                formMonth: { byLevel: { 3: 2 }, ancestors: 1 },
                formQuart: { byLevel: { 2: 1 }, ancestors: 0 },
            },
        })
        expect(coverage).toMatchObject({ rootIds: [], userOrgUnitIds: null })
    })

    it('counts only the levels a data set is assigned at', async () => {
        const coverage = await fetchFor(['nationUnit1'], dataSets('formQuart'))

        expect(coverage.counts.nationUnit1).toEqual({
            totals: { 2: 2 },
            sources: { formQuart: { byLevel: { 2: 2 }, ancestors: 0 } },
        })
        expect(coverage.requests).toBe(3 + 2)
    })

    it('reuses the level counts it is given', async () => {
        const engine = createEngine()
        const coverage = await fetchOrgUnitCoverage(engine, {
            sources: dataSets('formQuart'),
            orgUnits: ['nationUnit1'],
            assignedOrgUnitCounts: { formQuart: { 2: 2 } },
        })

        expect(coverage.assignedOrgUnitCounts).toEqual({ formQuart: { 2: 2 } })
        expect(coverage.requests).toBe(2)
    })

    it('loads the roots for a level alone', async () => {
        const coverage = await fetchFor(['LEVEL-3'])

        expect(coverage.rootIds).toEqual(['nationUnit1'])
        expect(coverage.counts.nationUnit1.totals).toEqual({ 1: 1, 2: 2, 3: 3 })
    })

    it('loads the user units, from the data view ones first', async () => {
        const coverage = await fetchFor(['USER_ORGUNIT_CHILDREN'])

        expect(coverage.userOrgUnitIds).toEqual(['districtAAA'])
    })

    it('falls back to the user data capture units', async () => {
        const engine = createEngine()
        const query = engine.query

        engine.query = jest.fn(async (request) => {
            const response = await query(request)

            return response.me
                ? { ...response, me: { organisationUnits: [UNITS[0]] } }
                : response
        })

        const coverage = await fetchOrgUnitCoverage(engine, {
            sources: [],
            orgUnits: ['USER_ORGUNIT'],
        })

        expect(coverage.userOrgUnitIds).toEqual(['nationUnit1'])
        expect(coverage.counts).toEqual({})
    })

    it('counts a group per level its members are at', async () => {
        const coverage = await fetchFor(['OU_GROUP-mixedGroupA'])

        expect(coverage.groups).toEqual({ mixedGroupA: { 2: 1, 3: 1 } })
        expect(coverage.rootIds).toEqual([])
        expect(coverage.counts).toEqual({
            'mixedGroupA:2:': {
                totals: { 2: 1, 3: 1 },
                sources: {
                    formMonth: { byLevel: { 3: 0 }, ancestors: 1 },
                    formQuart: { byLevel: { 2: 1 }, ancestors: 0 },
                },
            },
            'mixedGroupA:3:': {
                totals: { 3: 1 },
                sources: {
                    formMonth: { byLevel: { 3: 1 }, ancestors: 1 },
                    formQuart: { byLevel: {}, ancestors: 1 },
                },
            },
        })
    })

    it('counts a group within each boundary at or above its members', async () => {
        const coverage = await fetchFor(
            ['districtAAA', 'facilityCCC', 'OU_GROUP-clinicGroup'],
            dataSets('formMonth')
        )

        expect(coverage.counts['clinicGroup:3:districtAAA']).toEqual({
            totals: { 3: 1 },
            sources: { formMonth: { byLevel: { 3: 1 }, ancestors: 1 } },
        })
        expect(coverage.counts['clinicGroup:3:facilityCCC']).toEqual({
            totals: { 3: 1 },
            sources: { formMonth: { byLevel: { 3: 0 }, ancestors: 1 } },
        })
    })

    it('sends no count without units or data sets', async () => {
        expect(await fetchOrgUnitCoverage(createEngine(), {})).toMatchObject({
            orgUnits: {},
            counts: {},
            requests: 0,
        })
    })
})

describe('getCountableSources', () => {
    it('lists the data sets and programs behind profiles, once each', () => {
        expect(
            getCountableSources([
                {
                    sources: [
                        { dataSet: { id: 'formA' } },
                        { dataSet: null },
                        { dataSet: null, program: { id: 'programA' } },
                        {
                            dataSet: null,
                            program: { id: 'programB' },
                            orgUnitField: 'REGISTRATION',
                        },
                    ],
                },
                { sources: [{ dataSet: { id: 'formA' } }] },
                undefined,
            ])
        ).toEqual([
            { id: 'formA', field: 'dataSets' },
            { id: 'programA', field: 'programs' },
        ])
        expect(getCountableSources()).toEqual([])
    })
})

describe('fetchAssignedOrgUnitCounts', () => {
    it('fetches the levels, then counts each source per level', async () => {
        const result = await fetchAssignedOrgUnitCounts(createEngine(), [
            ...dataSets('formMonth', 'formNone'),
            { id: 'eventProgra', field: 'programs' },
        ])

        expect(result).toEqual({
            levels: [
                { id: 'level1', level: 1, name: 'Level 1' },
                { id: 'level2', level: 2, name: 'Level 2' },
                { id: 'level3', level: 3, name: 'Level 3' },
            ],
            assignedOrgUnitCounts: {
                formMonth: { 1: 1, 3: 2 },
                formNone: {},
                eventProgra: { 3: 3 },
            },
            requests: 9,
        })
    })
})
