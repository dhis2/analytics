import { VIS_TYPE_COLUMN } from '../../../../../modules/visTypes.js'
import getCumulativeData from '../getCumulativeData.js'

const testData = [
    {
        data: [1, 1, 1],
        accData: [1, 2, 3],
    },
    {
        data: [1.5, 2.5, 3.5],
        accData: [1.5, 4, 7.5],
    },
    {
        data: [-1, -1, -1],
        accData: [-1, -2, -3],
    },
    {
        data: [null, 1],
        accData: [null, 1],
    },
    {
        data: [1, null],
        accData: [1, null],
    },
    {
        data: [null, null],
        accData: [null, null],
    },
    {
        data: [1, null, 2],
        accData: [1, null, 3],
    },
]

describe('getDefaultCumulativeData', () => {
    const getDefaultSeries = (test, prop) => [
        {
            data: test[prop],
        },
    ]

    test('series get correct cumulative values', () => {
        testData.forEach((test) => {
            expect(
                getCumulativeData(getDefaultSeries(test, 'data'), {})
            ).toEqual(getDefaultSeries(test, 'accData'))
        })
    })
})

describe('getTwoCategoryCumulativeData', () => {
    const getTwoCategorySeries = (test, prop) => [
        {
            data: test[prop].map((value, index) => [index, value]),
            custom: {
                data: [test[prop]],
            },
        },
    ]

    const layout = {
        type: VIS_TYPE_COLUMN,
        rows: [{}, {}],
    }

    test('series get correct cumulative values', () => {
        testData.forEach((test) => {
            expect(
                getCumulativeData(getTwoCategorySeries(test, 'data'), layout)
            ).toEqual(getTwoCategorySeries(test, 'accData'))
        })
    })
})
