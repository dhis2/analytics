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
     * @param {Object} [options] Optional configurations, see {@link module:analytics.AnalyticsBase#fetch}
     *
     * @returns {Promise} Promise that resolves with the analytics query data from the api.
     *
     * @example
        // TODO: provide working example
     */
    getQuery(req, options) {
        return this.fetch(req.withPath('trackedEntities/query'), options)
    }
}

export default AnalyticsTrackedEntities
