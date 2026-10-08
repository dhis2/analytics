import { PivotTableEngine } from '../PivotTableEngine.js'

/* The engine measures every cell against a canvas 2d context, which jsdom
 * does not implement. */
jest.mock('../measureText.js', () => ({
    measureTextWithWrapping: () => ({ width: 100, height: 20 }),
}))

const OU_A = 'ouA'
const OU_B = 'ouB'
const STAGE = 'Zj7UnCAulEk'

/* Bo sorts after Bombali alphabetically but before it in hierarchy order,
 * so the two orderings disagree and the test can tell them apart. */
const OU_NAME_HIERARCHY = {
    [OU_A]: '/Sierra Leone/Western Area/Bo',
    [OU_B]: '/Sierra Leone/Northern Province/Bombali',
}

const buildData = (ouDimensionId) => ({
    headers: [
        { name: ouDimensionId, meta: true },
        { name: 'value', meta: false },
    ],
    metaData: {
        items: {
            [ouDimensionId]: { name: 'Organisation unit' },
            [OU_A]: { uid: OU_A, name: 'Bo' },
            [OU_B]: { uid: OU_B, name: 'Bombali' },
        },
        dimensions: { [ouDimensionId]: [OU_A, OU_B] },
        ouNameHierarchy: OU_NAME_HIERARCHY,
    },
    rows: [
        [OU_A, '1'],
        [OU_B, '2'],
    ],
    height: 2,
    width: 2,
})

const buildVisualization = (ouDimensionId) => ({
    showHierarchy: true,
    rows: [{ dimension: ouDimensionId }],
    columns: [],
    filters: [],
})

const rowHierarchies = (engine) =>
    [0, 1].map((row) => engine.getRowHeader(row)[0].hierarchy)

const rowNames = (engine) =>
    [0, 1].map((row) => engine.getRowHeader(row)[0].name)

const cellValues = (engine) =>
    [0, 1].map((row) => engine.get({ row, column: 0 })?.renderedValue)

describe('PivotTableEngine org unit hierarchy', () => {
    it('applies the hierarchy to a bare `ou` dimension', () => {
        const engine = new PivotTableEngine({
            visualization: buildVisualization('ou'),
            data: buildData('ou'),
        })

        expect(rowHierarchies(engine)).toEqual([
            ['Sierra Leone', 'Northern Province', 'Bombali'],
            ['Sierra Leone', 'Western Area', 'Bo'],
        ])
    })

    it('applies the hierarchy to a stage-qualified `ou` dimension', () => {
        const dimension = `${STAGE}.ou`
        const engine = new PivotTableEngine({
            visualization: buildVisualization(dimension),
            data: buildData(dimension),
        })

        expect(rowHierarchies(engine)).toEqual([
            ['Sierra Leone', 'Northern Province', 'Bombali'],
            ['Sierra Leone', 'Western Area', 'Bo'],
        ])
    })

    it('applies the hierarchy to an `enrollmentou` dimension', () => {
        const engine = new PivotTableEngine({
            visualization: buildVisualization('enrollmentou'),
            data: buildData('enrollmentou'),
        })

        expect(rowHierarchies(engine)).toEqual([
            ['Sierra Leone', 'Northern Province', 'Bombali'],
            ['Sierra Leone', 'Western Area', 'Bo'],
        ])
    })

    it('leaves items untouched when showHierarchy is off', () => {
        const engine = new PivotTableEngine({
            visualization: {
                ...buildVisualization(`${STAGE}.ou`),
                showHierarchy: false,
            },
            data: buildData(`${STAGE}.ou`),
        })

        expect(rowHierarchies(engine)).toEqual([undefined, undefined])
        expect(engine.getRowHeader(0)[0].uid).toBe(OU_A)
    })

    /* Sorting rewrites itemIds, which the row lookup resolves data rows
     * through. If the two fall out of step every cell renders empty. */
    it('keeps values aligned with the re-sorted rows', () => {
        const engine = new PivotTableEngine({
            visualization: buildVisualization(`${STAGE}.ou`),
            data: buildData(`${STAGE}.ou`),
        })

        expect(rowNames(engine)).toEqual(['Bombali', 'Bo'])
        expect(cellValues(engine)).toEqual(['2', '1'])
    })

    /* A backend that returns no hierarchy for the requested dimension still
     * sends the key, as an empty object, which passes the truthiness guard. */
    it('is inert when ouNameHierarchy is empty', () => {
        const dimension = `${STAGE}.ou`
        const data = buildData(dimension)
        data.metaData.ouNameHierarchy = {}

        const engine = new PivotTableEngine({
            visualization: buildVisualization(dimension),
            data,
        })

        expect(rowNames(engine)).toEqual(['Bo', 'Bombali'])
        expect(rowHierarchies(engine)).toEqual([undefined, undefined])
        expect(cellValues(engine)).toEqual(['1', '2'])
    })

    it('leaves non-org-unit dimensions untouched', () => {
        const dimension = `${STAGE}.de1`
        const engine = new PivotTableEngine({
            visualization: buildVisualization(dimension),
            data: buildData(dimension),
        })

        expect(rowHierarchies(engine)).toEqual([undefined, undefined])
    })
})
