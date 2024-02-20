import AnalyticsBase, { generateDimensionStrings } from '../AnalyticsBase.js'

let base

describe('constructor', () => {
    beforeEach(() => {
        base = new AnalyticsBase()
    })

    it('should not be allowed to be called without new', () => {
        expect(() => AnalyticsBase()).toThrowErrorMatchingSnapshot()
    })

    it('should use the dataEngine mock object when it is passed', () => {
        const dataEngineMock = {}

        base = new AnalyticsBase(dataEngineMock)

        expect(base.dataEngine).toBe(dataEngineMock)
    })
})

describe('generateDimensionString', () => {
    const tests = [
        {
            input: [
                {
                    dimension: 'dim2',
                    items: ['item2', 'item1'],
                },
                {
                    dimension: 'dim1',
                    items: ['item1'],
                },
            ],
            output: ['dim2:item2;item1', 'dim1:item1'],
            outputSorted: ['dim1:item1', 'dim2:item1;item2'],
        },
    ]

    it('should return dimension strings correctly formatted', () => {
        tests.forEach(({ input, output }) => {
            expect(generateDimensionStrings(input)).toEqual(output)
        })
    })

    it('should return dimension strings correctly formatted and sorted', () => {
        tests.forEach(({ input, outputSorted }) => {
            expect(generateDimensionStrings(input, { sorted: true })).toEqual(
                outputSorted
            )
        })
    })
})
