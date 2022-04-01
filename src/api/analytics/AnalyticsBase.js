import sortBy from 'lodash/sortBy'
import AnalyticsRequest from './AnalyticsRequest.js'

const analyticsQuery = {
    resource: 'analytics',
    id: ({ path, program }) => {
        return [path, program].filter(Boolean).join('/')
    },
    params: ({ dimensions, filters, parameters }) => ({
        dimension: dimensions,
        filter: filters,
        ...parameters,
    }),
}

const analyticsDataQuery = {
    resource: 'analytics',
    id: ({ path, program }) => {
        return [path, program].filter(Boolean).join('/')
    },
    params: ({ dimensions, filters, parameters }) => {
        return {
            dimension: dimensions,
            filter: filters,
            ...parameters,
            skipMeta: true,
            skipData: false,
        }
    },
}

const analyticsMetaDataQuery = {
    resource: 'analytics',
    id: ({ path, program }) => {
        return [path, program].filter(Boolean).join('/')
    },
    params: ({ dimensions, filters, parameters }) => ({
        dimension: dimensions,
        filter: filters,
        ...parameters,
        skipMeta: false,
        skipData: true,
        includeMetadataDetails: true,
    }),
}

const generateDimensionStrings = (dimensions = [], options) => {
    if (options && options.sorted) {
        dimensions = sortBy(dimensions, 'dimension')
    }

    return dimensions.map(({ dimension, items }) => {
        if (Array.isArray(items) && items.length) {
            if (options && options.sorted) {
                items.sort()
            }

            return `${dimension}:${items.join(';')}`
        }

        return dimension
    })
}

/**
 * @private
 * @description
 * Base class for communicating with the analytics API endpoint.
 * Its subclasses can be used to get analytics data.
 *
 * @param {Instance} [dataEngine=<DataEngine>] dataEngine to use for the requests
 *
 * @memberof module:analytics
 * @abstract
 */
class AnalyticsBase {
    constructor(dataEngine) {
        this.dataEngine = dataEngine
    }

    /**
     * Loads the analytics data and returns them as an object from the promise.
     * Two parallel requests are made against the analytics api.
     * One for getting only the metaData and one for getting the actual data.
     * This is for caching purposes, as in many situations the metaData request changes while
     * the data one will be the same and thus have the same response.
     * This methods takes care of adding the default extra parameters to both requests.
     *
     * @param {!AnalyticsRequest} req Analytics request object with the request details
     *
     * @returns {Promise} Promise that resolves with the analytics data and metaData from the api.
     *
     * @example
     * const req = new analytics.request()
     *  .addDataDimension(['Uvn6LCg7dVU','OdiHJayrsKo'])
     *  .addPeriodDimension('LAST_4_QUARTERS')
     *  .addOrgUnitDimension(['lc3eMKXaEfw','PMa2VCrupOd']);
     *
     * analytics.aggregate
     *  .get(req)
     *  .then(analyticsData => console.log('Analytics data', analyticsData))
     *
     * // { metaData: { ... }, rows: [ ... ], headers: [ ... ], height: 0, width: 0 }
     */
    async get(req) {
        // keep metaData and data requests separate for caching purposes
        const metaDataReq = new AnalyticsRequest(req)
            .withSkipMeta(false)
            .withSkipData(true)
            .withIncludeMetadataDetails(true)

        const dataReq = new AnalyticsRequest(req)
            .withSkipData(false)
            .withSkipMeta(true)

        // but run them in parallel
        const response = await this.dataEngine.query(
            { data: analyticsDataQuery, metaData: analyticsMetaDataQuery },
            {
                variables: {
                    path: req.path,
                    program: req.program,
                    dimensions: generateDimensionStrings(req.dimensions),
                    filters: generateDimensionStrings(req.filters),
                    parameters: req.parameters,
                    dataParams: dataReq.parameters,
                    metaDataParams: metaDataReq.parameters,
                },
            }
        )

        return {
            ...response.data,
            metaData: response.metaData.metaData,
        }
    }

    /**
     * @private
     * @description
     * This method does not manipulate the request object, but directly requests the data from the api
     * based on the request's configuration.
     *
     * @param {!AnalyticsRequest} req Request object
     * @param {Object} options Optional configurations, ie. for sorting dimensions
     *
     * @returns {Promise} Promise that resolves with the data from the api.
     *
     * @example
     * const req = new analytics.request()
     *  .fromModel(chartModel)
     *  .withSkipData();
     *
     * analytics.aggregate
     *  .fetch(req)
     *  .then(analyticsData => console.log('Analytics data', analyticsData))
     *
     * // { metaData: { ... }, rows: [], height: 0, width: 0 }
     */
    async fetch(req, options) {
        const response = await this.dataEngine.query(
            { data: analyticsQuery },
            {
                variables: {
                    path: req.path,
                    program: req.program,
                    dimensions: generateDimensionStrings(
                        req.dimensions,
                        options
                    ),
                    filters: generateDimensionStrings(req.filters, options),
                    parameters: req.parameters,
                },
            }
        )

        return response.data
    }
}

export default AnalyticsBase
