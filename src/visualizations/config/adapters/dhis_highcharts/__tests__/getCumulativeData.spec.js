import { getDefaultCumulativeData } from "../getCumulativeData.js";

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

const getSeries = (test, prop) => {
    return [
        {
            data: test[prop]
        }
    ]
}

describe('getDefaultCumulativeData', () => {
    test('series gets correct cumulative values', () => {
        testData.forEach(test => {
            expect(getDefaultCumulativeData(getSeries(test, 'data'))).toEqual(getSeries(test, 'expectedAcc'))
        })
    })
})