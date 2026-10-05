import { createFakeOrgUnitServer } from '../../../__fixtures__/fakeOrgUnitServer.js'
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

const fetchFor = (orgUnits, sourceKeys = dataSets('formMonth', 'formQuart')) =>
    fetchOrgUnitCoverage(createEngine(), { sourceKeys, orgUnits })

describe('fetchOrgUnitCoverage', () => {
    it('counts the org units and assignments under an org unit, per level', async () => {
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
        // Levels and org unit, 3 assigned counts, 2 counts under the nation
        expect(coverage.requests).toBe(2 + 3 + 2)
    })

    it('reuses the level counts it is given', async () => {
        const engine = createEngine()
        const coverage = await fetchOrgUnitCoverage(engine, {
            sourceKeys: dataSets('formQuart'),
            orgUnits: ['nationUnit1'],
            assignedOrgUnitCounts: { formQuart: { 2: 2 } },
        })

        expect(coverage.assignedOrgUnitCounts).toEqual({ formQuart: { 2: 2 } })
        expect(coverage.requests).toBe(2 + 2)
    })

    it('loads the roots for a level alone', async () => {
        const coverage = await fetchFor(['LEVEL-3'])

        expect(coverage.rootIds).toEqual(['nationUnit1'])
        expect(coverage.counts.nationUnit1.totals).toEqual({ 1: 1, 2: 2, 3: 3 })
    })

    it('loads the user org units, from the data view ones first', async () => {
        const coverage = await fetchFor(['USER_ORGUNIT_CHILDREN'])

        expect(coverage.userOrgUnitIds).toEqual(['districtAAA'])
    })

    it('falls back to the user data capture org units', async () => {
        const engine = createEngine()
        const query = engine.query

        engine.query = jest.fn(async (request) => {
            const response = await query(request)

            return response.me
                ? { ...response, me: { organisationUnits: [UNITS[0]] } }
                : response
        })

        const coverage = await fetchOrgUnitCoverage(engine, {
            sourceKeys: [],
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

    it('counts a group under each parent at or above its members', async () => {
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

    it('counts a group under the user org units as parents', async () => {
        const coverage = await fetchFor(
            ['USER_ORGUNIT', 'OU_GROUP-clinicGroup'],
            dataSets('formMonth')
        )

        expect(coverage.rootIds).toEqual([])
        expect(coverage.counts['clinicGroup:3:districtAAA']).toEqual({
            totals: { 3: 1 },
            sources: { formMonth: { byLevel: { 3: 1 }, ancestors: 1 } },
        })
    })

    it('sends no count without org units or data sets', async () => {
        expect(await fetchOrgUnitCoverage(createEngine(), {})).toMatchObject({
            orgUnits: {},
            counts: {},
            requests: 0,
        })
    })
})

describe('fetchOrgUnitCoverage, for a large selection', () => {
    // 60 data sets assigned as formMonth is: over 100 counts under the nation
    const formIds = Array.from({ length: 60 }, (_, i) => `form${i}`)
    const { createEngine: createLargeEngine } = createFakeOrgUnitServer({
        orgUnits: UNITS.map((orgUnit) => ({
            ...orgUnit,
            dataSets: orgUnit.dataSets.includes('formMonth') ? formIds : [],
        })),
        groups: GROUPS,
    })

    it('counts from lists of each data set’s org units, as the server would', async () => {
        const orgUnits = ['nationUnit1', 'OU_GROUP-mixedGroupA']
        const engine = createLargeEngine()
        const coverage = await fetchOrgUnitCoverage(engine, {
            sourceKeys: dataSets(...formIds),
            orgUnits,
        })
        const expected = await fetchFor(orgUnits, dataSets('formMonth'))
        const sourcesOf = (counted) =>
            Object.fromEntries(
                Object.entries(counted).map(([key, { totals, sources }]) => [
                    key,
                    { totals, sources: sources.form59 ?? sources.formMonth },
                ])
            )
        const listRequests = engine.query.mock.calls.filter(([query]) =>
            Object.values(query).some(({ params }) => params?.fields === 'path')
        )

        expect(sourcesOf(coverage.counts)).toEqual(sourcesOf(expected.counts))
        expect(listRequests).not.toHaveLength(0)
    })
})

describe('fetchOrgUnitCoverage, after an earlier selection', () => {
    it('fetches only what the earlier coverage lacks', async () => {
        const engine = createEngine()
        const previous = await fetchOrgUnitCoverage(engine, {
            sourceKeys: dataSets('formMonth'),
            orgUnits: ['districtAAA'],
        })

        engine.query.mockClear()
        const coverage = await fetchOrgUnitCoverage(engine, {
            sourceKeys: dataSets('formMonth'),
            orgUnits: ['districtAAA', 'districtBBB'],
            previous,
        })
        const sent = engine.query.mock.calls.flatMap(([query]) =>
            Object.values(query)
        )

        expect(coverage.counts.districtAAA).toEqual(previous.counts.districtAAA)
        expect(coverage.counts.districtBBB).toBeDefined()
        expect(
            sent.some(({ resource }) => resource !== 'organisationUnits')
        ).toBe(false)
        expect(
            sent.some(({ params }) =>
                params.filter.includes?.('path:like:districtAAA')
            )
        ).toBe(false)
    })

    it('counts again when the sources change', async () => {
        const engine = createEngine()
        const previous = await fetchOrgUnitCoverage(engine, {
            sourceKeys: dataSets('formMonth'),
            orgUnits: ['districtAAA'],
        })
        const coverage = await fetchOrgUnitCoverage(engine, {
            sourceKeys: dataSets('formMonth', 'formQuart'),
            orgUnits: ['districtAAA'],
            previous,
        })

        expect(coverage.counts.districtAAA.sources.formQuart).toBeDefined()
        expect(coverage.sourceIds).toEqual(['formMonth', 'formQuart'])
    })

    it('reuses the roots and user org units it knows', async () => {
        const engine = createEngine()
        const previous = await fetchOrgUnitCoverage(engine, {
            orgUnits: ['LEVEL-2', 'USER_ORGUNIT'],
        })

        engine.query.mockClear()
        const coverage = await fetchOrgUnitCoverage(engine, {
            orgUnits: ['LEVEL-3', 'USER_ORGUNIT'],
            previous,
        })

        expect(engine.query).not.toHaveBeenCalled()
        expect(coverage.userOrgUnitIds).toEqual(['districtAAA'])
    })
})
