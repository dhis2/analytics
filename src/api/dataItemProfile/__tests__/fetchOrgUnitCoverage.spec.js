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
    it('counts the assignments under an org unit, per level, and its assigned ancestors', async () => {
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
        // Ancestors are counted only for a data set assigned higher somewhere
        expect(coverage.counts.districtAAA).toEqual({
            totals: {},
            sources: {
                formMonth: { byLevel: { 3: 2 }, ancestors: 1 },
                formQuart: { byLevel: { 2: 1 } },
            },
        })
        expect(coverage).toMatchObject({
            rootIds: ['nationUnit1'],
            userOrgUnitIds: null,
        })
    })

    it('counts the org units under it too, with assignment totals', async () => {
        const coverage = await fetchOrgUnitCoverage(createEngine(), {
            sourceKeys: dataSets('formMonth', 'formQuart'),
            orgUnits: ['districtAAA'],
            withAssignmentTotals: true,
        })

        expect(coverage.counts.districtAAA.totals).toEqual({ 2: 1, 3: 2 })
    })

    it('reads the only root from the counts across the hierarchy', async () => {
        const coverage = await fetchFor(['nationUnit1'], dataSets('formQuart'))

        expect(coverage.counts.nationUnit1).toEqual({
            totals: {},
            sources: { formQuart: { byLevel: { 2: 2 } } },
        })
        // Levels, org unit and roots, then 3 assigned counts, and none under the nation
        expect(coverage.requests).toBe(3 + 3)
    })

    it('reuses the level counts it is given', async () => {
        const engine = createEngine()
        const coverage = await fetchOrgUnitCoverage(engine, {
            sourceKeys: dataSets('formQuart'),
            orgUnits: ['districtAAA'],
            assignedOrgUnitCounts: { formQuart: { 2: 2 } },
        })

        expect(coverage.assignedOrgUnitCounts).toEqual({ formQuart: { 2: 2 } })
        // Levels, org unit and roots, then the one count under the district
        expect(coverage.requests).toBe(3 + 1)
    })

    it('loads the roots, and counts under them for a level alone', async () => {
        const coverage = await fetchOrgUnitCoverage(createEngine(), {
            sourceKeys: dataSets('formMonth', 'formQuart'),
            orgUnits: ['LEVEL-3'],
            withAssignmentTotals: true,
        })

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

    it('counts a group per level its members are at, with its members', async () => {
        const coverage = await fetchFor(['OU_GROUP-mixedGroupA'])

        expect(coverage.groups).toEqual({ mixedGroupA: { 2: 1, 3: 1 } })
        expect(coverage.counts).toEqual({
            'mixedGroupA:2:': {
                totals: { 2: 1 },
                sources: {
                    formMonth: { byLevel: { 3: 0 }, ancestors: 1 },
                    formQuart: { byLevel: { 2: 1 } },
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

    it('counts the org units under the members, with assignment totals', async () => {
        const coverage = await fetchOrgUnitCoverage(createEngine(), {
            sourceKeys: dataSets('formMonth', 'formQuart'),
            orgUnits: ['OU_GROUP-mixedGroupA'],
            withAssignmentTotals: true,
        })

        expect(coverage.counts['mixedGroupA:2:'].totals).toEqual({ 2: 1, 3: 1 })
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

    it('keeps the lists for the next selection', async () => {
        const engine = createLargeEngine()
        const previous = await fetchOrgUnitCoverage(engine, {
            sourceKeys: dataSets(...formIds),
            orgUnits: ['OU_GROUP-mixedGroupA'],
        })

        engine.query.mockClear()
        const coverage = await fetchOrgUnitCoverage(engine, {
            sourceKeys: dataSets(...formIds),
            orgUnits: ['OU_GROUP-mixedGroupA', 'districtAAA', 'districtBBB'],
            previous,
        })
        const listRequests = engine.query.mock.calls.filter(([query]) =>
            Object.values(query).some(({ params }) => params?.fields === 'path')
        )

        expect(Object.keys(previous.lists.sources)).toHaveLength(60)
        expect(coverage.counts.districtAAA.sources.form0.byLevel).toEqual({
            3: 2,
        })
        expect(listRequests).toHaveLength(0)
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

    it('counts only the new data set when the sources change', async () => {
        const engine = createEngine()
        const previous = await fetchOrgUnitCoverage(engine, {
            sourceKeys: dataSets('formMonth'),
            orgUnits: ['districtAAA'],
        })

        engine.query.mockClear()
        const coverage = await fetchOrgUnitCoverage(engine, {
            sourceKeys: dataSets('formMonth', 'formQuart'),
            orgUnits: ['districtAAA'],
            previous,
        })
        const sentFilters = engine.query.mock.calls.flatMap(([query]) =>
            Object.values(query).flatMap(({ params }) => params?.filter ?? [])
        )

        expect(coverage.counts.districtAAA.sources.formQuart).toBeDefined()
        expect(coverage.counts.districtAAA.sources.formMonth).toEqual(
            previous.counts.districtAAA.sources.formMonth
        )
        expect(sentFilters).toContain('dataSets.id:eq:formQuart')
        expect(sentFilters).not.toContain('dataSets.id:eq:formMonth')
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
