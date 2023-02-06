import Analytics from '../Analytics.js'
import AnalyticsAggregate from '../AnalyticsAggregate.js'
import AnalyticsEvents from '../AnalyticsEvents.js'
import AnalyticsRequest from '../AnalyticsRequest.js'

describe('Analytics', () => {
    let analytics

    beforeEach(() => {
        analytics = new Analytics({
            aggregate: new AnalyticsAggregate(),
            events: new AnalyticsEvents(),
            request: AnalyticsRequest,
        })
    })

    it('should create an instance of Analytics', () => {
        expect(Analytics.getAnalytics()).toBeInstanceOf(Analytics)
    })

    it('should not be allowed to be called without new', () => {
        expect(() => Analytics()).toThrowErrorMatchingSnapshot()
    })

    it('should contain an instance of AnalyticsAggregate', () => {
        expect(analytics.aggregate).toBeInstanceOf(AnalyticsAggregate)
    })

    it('should contain an instance of AnalyticsEvents', () => {
        expect(analytics.events).toBeInstanceOf(AnalyticsEvents)
    })

    it('should contain a reference to AnalyticsRequest', () => {
        expect(analytics.request).toBe(AnalyticsRequest)
    })

    describe('getAnalytics', () => {
        it('should return the same instance on consecutive requests', () => {
            expect(Analytics.getAnalytics()).toBe(Analytics.getAnalytics())
        })
    })
})
