import AnalyticsBase, { generateDimensionStrings } from '../AnalyticsBase.js'
import AnalyticsRequest from '../AnalyticsRequest.js'

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
            output: ['dim1:item1', 'dim2:item2;item1'],
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

describe('abort signal', () => {
    let dataEngineMock
    let req

    beforeEach(() => {
        dataEngineMock = {
            query: jest.fn().mockResolvedValue({
                data: { rows: [] },
                metaData: { metaData: {} },
            }),
        }
        base = new AnalyticsBase(dataEngineMock)
        req = new AnalyticsRequest()
            .withPath('events/query')
            .addDimension('dim1', ['item2', 'item1'])
    })

    describe('.fetch()', () => {
        it('should pass the signal from options to the data engine', async () => {
            const { signal } = new AbortController()

            await base.fetch(req, { signal })

            expect(dataEngineMock.query.mock.calls[0][1].signal).toBe(signal)
        })

        it('should pass no signal when no options are given', async () => {
            await base.fetch(req)

            expect(dataEngineMock.query.mock.calls[0][1].signal).toBeUndefined()
        })

        it('should still sort dimensions when a signal is passed alongside', async () => {
            const { signal } = new AbortController()

            await base.fetch(req, { sorted: true, signal })

            const [, { variables, signal: passedSignal }] =
                dataEngineMock.query.mock.calls[0]

            expect(variables.dimensions).toEqual(['dim1:item1;item2'])
            expect(passedSignal).toBe(signal)
        })
    })

    describe('.get()', () => {
        it('should pass the signal from options to the data engine', async () => {
            const { signal } = new AbortController()

            await base.get(req, { signal })

            expect(dataEngineMock.query.mock.calls[0][1].signal).toBe(signal)
        })

        it('should pass no signal when no options are given', async () => {
            await base.get(req)

            expect(dataEngineMock.query.mock.calls[0][1].signal).toBeUndefined()
        })
    })
})
