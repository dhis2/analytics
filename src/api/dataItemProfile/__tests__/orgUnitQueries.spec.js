import {
    assignedTo,
    countQuery,
    getTotal,
    inGroup,
    queryAll,
    readLevels,
} from '../orgUnitQueries.js'

describe('orgUnitQueries', () => {
    it('counts with one org unit per page', () => {
        expect(countQuery(['level:eq:2'])).toEqual({
            resource: 'organisationUnits',
            params: { filter: ['level:eq:2'], fields: 'id', pageSize: 1 },
        })
    })

    it('reads the total from the pager', () => {
        expect(getTotal({ pager: { total: 1166 } })).toBe(1166)
        expect(getTotal({ organisationUnits: [] })).toBe(0)
        expect(getTotal(undefined)).toBe(0)
    })

    it('filters by assignment and by group', () => {
        expect(assignedTo({ id: 'formAAAAAAA', field: 'dataSets' })).toBe(
            'dataSets.id:eq:formAAAAAAA'
        )
        expect(inGroup('groupAAAAAA')).toBe(
            'organisationUnitGroups.id:eq:groupAAAAAA'
        )
    })

    const createEngine = () => ({
        query: jest.fn(async (query) =>
            Object.fromEntries(
                Object.entries(query).map(([key, { params }]) => [
                    key,
                    { pager: { total: params.filter.length } },
                ])
            )
        ),
    })

    it('gives the responses in the order of the queries', async () => {
        const engine = createEngine()
        const signal = new AbortController().signal

        expect(
            await queryAll(
                engine,
                [
                    ['a', countQuery(['level:eq:1', 'level:eq:2'])],
                    ['b', countQuery(['level:eq:3'])],
                ],
                { signal }
            )
        ).toEqual({
            responses: [{ pager: { total: 2 } }, { pager: { total: 1 } }],
            requests: 2,
        })
        expect(engine.query).toHaveBeenCalledWith(
            {
                query0: countQuery(['level:eq:1', 'level:eq:2']),
                query1: countQuery(['level:eq:3']),
            },
            { signal }
        )
    })

    it('sends identical queries once', async () => {
        const engine = createEngine()
        const { responses, requests } = await queryAll(engine, [
            ['a', countQuery(['level:eq:1'])],
            ['b', countQuery(['level:eq:1'])],
        ])

        expect(responses).toEqual([
            { pager: { total: 1 } },
            { pager: { total: 1 } },
        ])
        expect(requests).toBe(1)
    })

    it('sends batches of 100 queries, one after the other', async () => {
        const engine = createEngine()
        const queries = Array.from({ length: 250 }, (_, i) => [
            i,
            countQuery([`level:eq:${i}`]),
        ])
        const { responses, requests } = await queryAll(engine, queries)

        expect(requests).toBe(250)
        expect(responses).toHaveLength(250)
        expect(
            engine.query.mock.calls.map(([query]) => Object.keys(query).length)
        ).toEqual([100, 100, 50])
    })

    it('sends nothing without queries', async () => {
        const engine = createEngine()

        expect(await queryAll(engine, [])).toEqual({
            responses: [],
            requests: 0,
        })
        expect(engine.query).not.toHaveBeenCalled()
    })

    it('sorts the levels', () => {
        expect(
            readLevels({
                levels: {
                    organisationUnitLevels: [
                        { id: 'levelTwo', level: 2, displayName: 'District' },
                        { id: 'levelOne', level: 1, displayName: 'National' },
                    ],
                },
            })
        ).toEqual([
            { id: 'levelOne', level: 1, name: 'National' },
            { id: 'levelTwo', level: 2, name: 'District' },
        ])
        expect(readLevels(undefined)).toEqual([])
    })
})
