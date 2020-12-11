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
        dimensions = [],
        filters = [],
        parameters = {},
    } = {}) {
        this.endPoint = endPoint
        this.format = format.toLowerCase()
        this.path = path
        this.program = program

        this.dimensions = dimensions
        this.filters = filters
        this.parameters = { ...parameters }
    }
}

export default AnalyticsRequestBase
