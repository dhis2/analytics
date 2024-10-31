import AnalyticsBase from './AnalyticsBase.js'

/**
 * @extends module:analytics.AnalyticsBase
 *
 * @description
 * Analytics tracked entities class used to request analytics tracked entities data from Web API.
 *
 * @memberof module:analytics
 */
class AnalyticsTrackedEntities extends AnalyticsBase {
    /**
     * @param {!AnalyticsRequest} req Request object
     *
     * @returns {Promise} Promise that resolves with the analytics query data from the api.
     *
     * @example
        // TODO: provide working example
     */
    getQuery(req) {
        return this.fetch(req.withPath('trackedEntities/query'))
    }
}

export default AnalyticsTrackedEntities
