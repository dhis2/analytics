/**
 * @module analytics
 */
import AnalyticsAggregate from './AnalyticsAggregate.js'
import AnalyticsEvents from './AnalyticsEvents.js'
import AnalyticsRequest from './AnalyticsRequest.js'
import AnalyticsResponse from './AnalyticsResponse.js'

/**
 * @description
 * Analytics class used to request analytics data from Web API.
 *
 * @requires analytics.AnalyticsAggregate
 * @requires analytics.AnalyticsEvents
 * @requires analytics.AnalyticsRequest
 * @requires analytics.AnalyticsResponse
 *
 * @example
 * const analytics = new Analytics(
 *  new AnalyticsAggregate(),
 *  new AnalyticsEvents(),
 *  AnalyticsRequest,
 *  AnalyticsResponse
 * )
 *
 * @memberof module:analytics
 * @see {@link https://docs.dhis2.org/master/en/developer/html/webapi_analytics.html} Analytics API documentation
 * @see {@link https://docs.dhis2.org/master/en/developer/html/webapi_event_analytics.html} Event analytics API documentation
 */
class Analytics {
    /**
     * @param {!module:analytics.AnalyticsAggregate} analyticsAggregate The AnalyticsAggregate instance
     * @param {!module:analytics.AnalyticsEvents} analyticsEvents The AnalyticsEvents instance
     * @param {!module:analytics.AnalyticsRequest} analyticsRequest The AnalyticsRequest class
     * @param {!module:analytics.AnalyticsResponse} analyticsResponse The AnalyticsResponse class
     */
    constructor({ aggregate, events, request, response }) {
        this.aggregate = aggregate
        this.events = events
        this.request = request
        this.response = response
    }

    /**
     * @static
     *
     * @description
     * Get a new instance of the Analytics object. This will function as a singleton, once Analytics object
     * has been created when requesting getAnalytics again the original version will be returned.
     *
     * @returns {Analytics} Object with the analytics interaction properties
     *
     * @example
     * const analytics = Analytics.getAnalytics();
     */
    static getAnalytics(dataEngine) {
        if (!Analytics.getAnalytics.analytics) {
            Analytics.getAnalytics.analytics = new Analytics({
                aggregate: new AnalyticsAggregate(dataEngine),
                events: new AnalyticsEvents(dataEngine),
                request: AnalyticsRequest,
                response: AnalyticsResponse,
            })
        }

        return Analytics.getAnalytics.analytics
    }
}

export default Analytics
