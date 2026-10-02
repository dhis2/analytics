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

    it('sends every query in one request, keyed by position', async () => {
        const engine = { query: jest.fn(async () => ({ count0: 1 })) }

        expect(await queryAll(engine, [['a', countQuery([])]])).toEqual({
            count0: 1,
        })
        expect(engine.query).toHaveBeenCalledWith({ count0: countQuery([]) })
        expect(await queryAll(engine, [])).toEqual({})
        expect(engine.query).toHaveBeenCalledTimes(1)
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
