import AnalyticsBase from './AnalyticsBase.js'

/**
 * @extends module:analytics.AnalyticsBase
 *
 * @description
 * Analytics events class used to request analytics events data from Web API.
 *
 * @memberof module:analytics
 *
 * @see https://docs.dhis2.org/master/en/developer/html/webapi_event_analytics.html
 */
class AnalyticsEvents extends AnalyticsBase {
    /**
     * @param {!AnalyticsRequest} req Request object
     *
     * @returns {Promise} Promise that resolves with the analytics aggregate data from the api.
     *
     * @example
     * const req = new analytics.request()
     *  .withProgram('eBAyeGv0exc')
     *  .addDataDimension(['Uvn6LCg7dVU','OdiHJayrsKo'])
     *  .addPeriodDimension('LAST_4_QUARTERS')
     *  .addOrgUnitDimension(['lc3eMKXaEfw','PMa2VCrupOd'])
     *  .addOrgUnitFilter('O6uvpzGd5pu')
     *  .withStartDate('2017-10-01')
     *  .withEndDate('2017-10-31');
     *
     * analytics.events.getAggregate(req)
     *  .then(console.log);
     */
    getAggregate(req) {
        return this.fetch(req.withPath('events/aggregate'))
    }

    /**
     * @param {!AnalyticsRequest} req Request object
     *
     * @returns {Promise} Promise that resolves with the analytics count data from the api.
     *
     * @example
     * const req = new analytics.request()
     *  .withProgram('eBAyeGv0exc')
     *  .addDataDimension(['Uvn6LCg7dVU','OdiHJayrsKo'])
     *  .addPeriodDimension('LAST_4_QUARTERS')
     *  .addOrgUnitDimension(['lc3eMKXaEfw','PMa2VCrupOd'])
     *  .addOrgUnitFilter('O6uvpzGd5pu')
     *  .withStartDate('2017-10-01')
     *  .withEndDate('2017-10-31');
     *
     *  analytics.events.getCount(req)
     *  .then(console.log);
     */
    getCount(req) {
        return this.fetch(req.withPath('events/count'))
    }

    /**
     * @param {!AnalyticsRequest} req Request object
     * Must contain clusterSize and bbox parameters.
     *
     * @returns {Promise} Promise that resolves with the analytics cluster data from the api.
     *
     * @example
     * const req = new analytics.request()
     *  .withProgram('eBAyeGv0exc')
     *  .addDataDimension(['Uvn6LCg7dVU','OdiHJayrsKo'])
     *  .addPeriodDimension('LAST_4_QUARTERS')
     *  .addOrgUnitDimension(['lc3eMKXaEfw','PMa2VCrupOd'])
     *  .addOrgUnitFilter('O6uvpzGd5pu')
     *  .withStartDate('2017-10-01')
     *  .withEndDate('2017-10-31')
     *  .withClusterSize(100000)
     *  .withBbox('-13.2682125,7.3721619,-10.4261178,9.904012');
     *
     *  analytics.events.getCluster(req)
     *  .then(console.log);
     */
    getCluster(req) {
        return this.fetch(req.withPath('events/cluster'))
    }

    /**
     * @param {!AnalyticsRequest} req Request object
     *
     * @returns {Promise} Promise that resolves with the analytics query data from the api.
     *
     * @example
     * const req = new analytics.request()
     *  .withProgram('eBAyeGv0exc')
     *  .addDataDimension(['Uvn6LCg7dVU','OdiHJayrsKo'])
     *  .addPeriodDimension('LAST_4_QUARTERS')
     *  .addOrgUnitDimension(['lc3eMKXaEfw','PMa2VCrupOd'])
     *  .addOrgUnitFilter('O6uvpzGd5pu')
     *  .withStartDate('2017-10-01')
     *  .withEndDate('2017-10-31');
     *
     *  analytics.events.getQuery(req)
     *  .then(console.log);
     */
    getQuery(req) {
        return this.fetch(req.withPath('events/query'))
    }
}

export default AnalyticsEvents
