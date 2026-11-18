import AnalyticsBase from './AnalyticsBase.js'

/**
 * @extends module:analytics.AnalyticsBase
 *
 * @description
 * Analytics aggregate class used to request aggregate analytics data from Web API.
 *
 * @memberof module:analytics
 *
 * @see https://docs.dhis2.org/master/en/developer/html/webapi_analytics.html
 */
class AnalyticsAggregate extends AnalyticsBase {
    /**
     * @param {!AnalyticsRequest} req Request object
     * @param {Object} [options] Optional configurations, see {@link module:analytics.AnalyticsBase#fetch}
     *
     * @returns {Promise} Promise that resolves with the analytics data value set data from the API.
     *
     * @example
     * const req = new analytics.request()
     *  .addDataDimension(['Uvn6LCg7dVU','OdiHJayrsKo'])
     *  .addPeriodDimension('LAST_4_QUARTERS')
     *  .addOrgUnitDimension(['lc3eMKXaEfw','PMa2VCrupOd'])
     *  .addOrgUnitFilter('O6uvpzGd5pu')
     *  .withStartDate('2017-10-01')
     *  .withEndDate('2017-10-31');
     *
     * analytics.aggregate.getDataValueSet(req)
     * .then(console.log);
     */
    getDataValueSet(req, options) {
        return this.fetch(req.withPath('dataValueSet'), options)
    }

    /**
     * @param {!AnalyticsRequest} req Request object
     * @param {Object} [options] Optional configurations, see {@link module:analytics.AnalyticsBase#fetch}
     *
     * @returns {Promise} Promise that resolves with the raw data from the API.
     *
     * @example
     * const req = new analytics.request()
     *  .addDataDimension(['Uvn6LCg7dVU','OdiHJayrsKo'])
     *  .addPeriodDimension('LAST_4_QUARTERS')
     *  .addOrgUnitDimension(['lc3eMKXaEfw', 'PMa2VCrupOd'])
     *  .addOrgUnitFilter('O6uvpzGd5pu');
     *  .withStartDate('2017-10-01')
     *  .withEndDate('2017-10-31')
     *  .withFormat('xml');
     *
     *  analytics.aggregate.getRawData(req)
     *  .then(console.log);
     */
    getRawData(req, options) {
        return this.fetch(req.withPath('rawData'), options)
    }

    /**
     * @param {!AnalyticsRequest} req Request object
     * @param {Object} [options] Optional configurations, see {@link module:analytics.AnalyticsBase#fetch}
     *
     * @returns {Promise} Promise that resolves with the SQL statement used to query the database.
     *
     * @example
     * const req = new analytics.request()
     *  .addDataDimension(['Uvn6LCg7dVU','OdiHJayrsKo'])
     *  .addPeriodDimension('LAST_4_QUARTERS')
     *  .addOrgUnitDimension(['lc3eMKXaEfw', 'PMa2VCrupOd'])
     *  .addOrgUnitFilter('O6uvpzGd5pu');
     *  .withStartDate('2017-10-01')
     *  .withEndDate('2017-10-31');
     *
     *  analytics.aggregate.getDebugSql(req)
     *  .then(console.log);
     */
    getDebugSql(req, options) {
        return this.fetch(req.withPath('debug/sql'), options)
    }

    /**
     * @param {!AnalyticsRequest} req Request object
     * @param {Object} [options] Optional configurations, see {@link module:analytics.AnalyticsBase#fetch}
     *
     * @returns {Promise} Promise that resolves with the SQL statement used to query the database.
     *
     * @example
     * const req = new analytics.request()
     *  .withParameters({
     *    dx: 'fbfJHSPpUQD,cYeuwXTCPkU',
     *    pe: 'THIS_YEAR',
     *    ou: 'USER_ORGUNIT,USER_ORGUNIT_CHILDREN',
     *    headers: 'dxname,pename,ouname,value,absdev,modifiedzscore,median,lowerbound,upperbound',
     *    algorithm: 'MODIFIED_Z_SCORE',
     *    maxResults: 100,
     *    threshold: 3,
          orderBy: 'value',
          sortOrder: 'desc',
     *  });
     *
     *  analytics.aggregate.getOutliersData(req)
     *  .then(console.log);
     */
    getOutliersData(req, options) {
        return this.fetch(req.withPath('outlierDetection'), options)
    }
}

export default AnalyticsAggregate
