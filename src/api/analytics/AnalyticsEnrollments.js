import AnalyticsBase from './AnalyticsBase.js'

/**
 * @extends module:analytics.AnalyticsBase
 *
 * @description
 * Analytics enrollments class used to request analytics enrollments data from Web API.
 *
 * @memberof module:analytics
 *
 * @see https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-236/analytics.html#webapi_enrollment_analytics
 */
class AnalyticsEnrollments extends AnalyticsBase {
    /**
     * @param {!AnalyticsRequest} req Request object
     * @param {Object} [options] Optional configurations, see {@link module:analytics.AnalyticsBase#get}
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
     * analytics.enrollments.getAggregate(req)
     *  .then(console.log);
     */
    getAggregate(req, options) {
        return this.get(req.withPath('enrollments/aggregate'), options)
    }

    /**
     * @param {!AnalyticsRequest} req Request object
     * @param {Object} [options] Optional configurations, see {@link module:analytics.AnalyticsBase#fetch}
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
     *  analytics.enrollments.getQuery(req)
     *  .then(console.log);
     */
    getQuery(req, options) {
        return this.fetch(req.withPath('enrollments/query'), options)
    }
}

export default AnalyticsEnrollments
