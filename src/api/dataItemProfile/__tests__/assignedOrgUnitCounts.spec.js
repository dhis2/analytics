import { createFakeOrgUnitServer } from '../../../__fixtures__/fakeOrgUnitServer.js'
import {
    fetchAssignedOrgUnitCounts,
    getDataItemProfileSourceKeys,
} from '../assignedOrgUnitCounts.js'

/* A nation with 2 districts and 3 facilities. formMonth: 2 of the 3
 * facilities, and the nation. eventProgra: the 3 facilities. */
const ORG_UNITS = [
    ['nationUnit1', 1, '/nationUnit1', ['formMonth']],
    ['districtAAA', 2, '/nationUnit1/districtAAA', []],
    ['districtBBB', 2, '/nationUnit1/districtBBB', []],
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
    orgUnits: ORG_UNITS,
    levels: [3, 1, 2],
})

const dataSets = (...ids) => ids.map((id) => ({ id, field: 'dataSets' }))

describe('getDataItemProfileSourceKeys', () => {
    it('lists the data sets and programs behind profiles, once each', () => {
        expect(
            getDataItemProfileSourceKeys([
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
        expect(getDataItemProfileSourceKeys()).toEqual([])
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
