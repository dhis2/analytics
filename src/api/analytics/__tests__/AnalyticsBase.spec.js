import AnalyticsBase from '../AnalyticsBase'

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
