import sortBy from 'lodash/sortBy'
import { customEncodeURIComponent } from './utils.js'

/**
 * @private
 * @description
 * Class for constructing a request object to use for communicating with the analytics API endpoint.
 *
 * @param {!Object} options Object with analytics request options
 *
 * @memberof module:analytics
 * @abstract
 */
class AnalyticsRequestBase {
    constructor({
        endPoint = 'analytics',
        format = 'json',
        path,
        program,
        trackedEntityType,
        dimensions = [],
        filters = [],
        parameters = {},
    } = {}) {
        this.endPoint = endPoint
        this.format = format.toLowerCase()
        this.path = path
        this.program = program
        this.trackedEntityType = trackedEntityType

        this.dimensions = dimensions
        this.filters = filters
        this.parameters = { ...parameters }
    }

    /**
     * @private
     * @description
     * Builds the URL to pass to the Api object.
     * The URL includes the dimension(s) parameters.
     * Used internally.
     *
     * @param {Object} options Optional configurations
     *
     * @returns {String} URL URL for the request with dimensions included
     */
    buildUrl(options) {
        // at least 1 dimension is required
        let dimensions = this.dimensions

        if (dimensions.length && options?.sorted) {
            dimensions = sortBy(dimensions, 'dimension')
        }

        const encodedDimensions = dimensions.map(({ dimension, items }) => {
            if (Array.isArray(items) && items.length) {
                const encodedItems = items.map(customEncodeURIComponent)
                if (options?.sorted) {
                    encodedItems.sort()
                }

                return `${dimension}:${encodedItems.join(';')}`
            }

            return dimension
        })

        const endPoint = [
            this.endPoint,
            this.path,
            this.program,
            this.trackedEntityType,
        ]
            .filter(Boolean)
            .join('/')

        let url = `${endPoint}.${this.format}`

        if (encodedDimensions.length) {
            url += `?dimension=${encodedDimensions.join('&dimension=')}`
        }

        return url
    }

    /**
     * @private
     * @description
     * Builds the query object passed to the API instance.
     * The object includes all the parameters added via with*() methods
     * and the filters added via addDataFilter(), addPeriodFilter(), addOrgUnitFilter(), addFilter().
     * The filters are handled by the API instance when building the final URL.
     * Used internally.
     *
     * @param {Object} options Optional configurations
     *
     * @returns {Object} Query parameters
     */
    buildQuery(options) {
        let filters = this.filters

        if (filters.length && options?.sorted) {
            filters = sortBy(filters, 'dimension')
        }

        const encodedFilters = filters.map(({ dimension, items }) => {
            if (Array.isArray(items) && items.length) {
                const encodedItems = items.map(customEncodeURIComponent)
                if (options?.sorted) {
                    encodedItems.sort()
                }

                return `${dimension}:${encodedItems.join(';')}`
            }

            return dimension
        })

        if (filters.length) {
            this.parameters.filter = encodedFilters
        }

        return this.parameters
    }
}

export default AnalyticsRequestBase
