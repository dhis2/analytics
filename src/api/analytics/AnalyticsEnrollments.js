import AnalyticsBase from './AnalyticsBase'

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
    getQuery(req) {
        return this.fetch(req.withPath('enrollments/query'))
    }
}

export default AnalyticsEnrollments
