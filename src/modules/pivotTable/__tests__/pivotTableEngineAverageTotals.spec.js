import { PivotTableEngine } from '../PivotTableEngine.js'

/* The engine measures every cell against a canvas 2d context, which jsdom
 * does not implement. */
jest.mock('../measureText.js', () => ({
    measureTextWithWrapping: () => ({ width: 100, height: 20 }),
}))

const RATE = 'BfMAe6Itzgt.REPORTING_RATE'
const BO = 'O6uvpzGd5pu'
const BOMBALI = 'fdc6uOvgoji'

const headers = [
    { name: 'dx', meta: true },
    { name: 'ou', meta: true },
    { name: 'value', meta: false },
    { name: 'numerator', meta: false },
    { name: 'denominator', meta: false },
    { name: 'factor', meta: false },
    { name: 'multiplier', meta: false },
    { name: 'divisor', meta: false },
]

const buildData = (rows) => ({
    headers,
    metaData: {
        items: {
            dx: { name: 'Data', dimensionType: 'DATA_X' },
            ou: { name: 'Organisation unit' },
            [RATE]: {
                name: 'Child Health - Reporting rate',
                dimensionItemType: 'REPORTING_RATE',
                valueType: 'NUMBER',
                totalAggregationType: 'AVERAGE',
            },
            [BO]: { uid: BO, name: 'Bo' },
            [BOMBALI]: { uid: BOMBALI, name: 'Bombali' },
        },
        dimensions: { dx: [RATE], ou: [BO, BOMBALI] },
    },
    rows,
    height: rows.length,
    width: headers.length,
})

const visualization = {
    columns: [{ dimension: 'dx' }],
    rows: [{ dimension: 'ou' }],
    filters: [],
    colTotals: true,
}

const getColumnTotal = (engine) =>
    engine.get({ row: engine.height - 1, column: 0 })

describe('PivotTableEngine AVERAGE totals', () => {
    it('falls back to factor when multiplier and divisor are missing', () => {
        const engine = new PivotTableEngine({
            visualization,
            data: buildData([
                [RATE, BO, '76.98', '97.0', '126.0', '100', '', ''],
                [RATE, BOMBALI, '94.79', '91.0', '96.0', '100', '', ''],
            ]),
        })

        // (97 + 91) * 100 / (126 + 96)
        expect(getColumnTotal(engine).rawValue).toBeCloseTo(84.68, 2)
    })

    it('uses multiplier and divisor when present', () => {
        const engine = new PivotTableEngine({
            visualization,
            data: buildData([
                [RATE, BO, '76.98', '97.0', '126.0', '401.1', '36500', '91'],
                [
                    RATE,
                    BOMBALI,
                    '94.79',
                    '91.0',
                    '96.0',
                    '401.1',
                    '36500',
                    '91',
                ],
            ]),
        })

        // (97 + 91) * 73000 / ((126 + 96) * 182)
        expect(getColumnTotal(engine).rawValue).toBeCloseTo(339.67, 2)
    })

    it('shows N/A instead of NaN when the total cannot be computed', () => {
        const engine = new PivotTableEngine({
            visualization,
            data: buildData([
                [RATE, BO, '76.98', '97.0', '126.0', '', '', ''],
                [RATE, BOMBALI, '94.79', '91.0', '96.0', '', '', ''],
            ]),
        })

        expect(getColumnTotal(engine).renderedValue).toBe('N/A')
    })
})
