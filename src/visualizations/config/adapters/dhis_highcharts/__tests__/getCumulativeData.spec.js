import { getDefaultCumulativeData, getTwoCategoryCumulativeData } from "../getCumulativeData.js";

const testData = [
    {
        data: [1, 1, 1],
        expectedAcc: [1, 2, 3]
    },
    {
        data: [1.5, 2.5, 3.5],
        expectedAcc: [1.5, 4, 7.5]
    },
    {
        data: [-1, -1, -1],
        expectedAcc: [-1, -2, -3]
    },
    {
        data: [null, 1],
        expectedAcc: [null, 1]
    },
    {
        data: [1, null],
        expectedAcc: [1, null]
    },
    {
        data: [null, null],
        expectedAcc: [null, null]
    },
    {
        data: [1, null, 2],
        expectedAcc: [1, null, 3]
    },
]

describe('getDefaultCumulativeData', () => {
    const getDefaultSeries = (test, prop) => [
        {
            data: test[prop]
        }
    ]

    test('series get correct cumulative values', () => {
        testData.forEach(test => {
            expect(getDefaultCumulativeData(getDefaultSeries(test, 'data'))).toEqual(getDefaultSeries(test, 'expectedAcc'))
        })
    })
})

describe('getTwoCategoryCumulativeData', () => {q
    const getTwoCategorySeries = (test, prop) => [
        {
            data: test[prop].map((value, index) => [index, value]),
            custom: {
                data: [
                    test[prop]
                ]
            }
        }
    ]

    test('series get correct cumulative values', () => {
        testData.forEach(test => {
            expect(getTwoCategoryCumulativeData(getTwoCategorySeries(test, 'data'))).toEqual(getTwoCategorySeries(test, 'expectedAcc'))
        })
    })
})