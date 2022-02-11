import { getFixedDimensions } from '../../modules/predefinedDimensions.js'
import AnalyticsRequestBase from './AnalyticsRequestBase.js'
import AnalyticsRequestDimensionsMixin from './AnalyticsRequestDimensionsMixin.js'
import AnalyticsRequestFiltersMixin from './AnalyticsRequestFiltersMixin.js'
import AnalyticsRequestPropertiesMixin from './AnalyticsRequestPropertiesMixin.js'

/**
 * @description
 * Class for constructing a request object to use for communicating with the analytics API endpoint.
 *
 * @param {!Object} options Object with analytics request options
 *
 * @memberof module:analytics
 *
 * @extends module:analytics.AnalyticsRequestDimensionsMixin
 * @extends module:analytics.AnalyticsRequestFiltersMixin
 * @extends module:analytics.AnalyticsRequestPropertiesMixin
 * @extends module:analytics.AnalyticsRequestBase
 */
class AnalyticsRequest extends AnalyticsRequestDimensionsMixin(
    AnalyticsRequestFiltersMixin(
        AnalyticsRequestPropertiesMixin(AnalyticsRequestBase)
    )
) {
    /**
     * Extracts dimensions and filters from an analytic object visualization and add them to the request
     *
     * @param {Object} visualization The analytics object visualization from which extract the dimensions/filters
     * @param {Boolean} [passFilterAsDimension=false] Pass filters as dimension in the query string (used in dataValueSet requests)
     *
     * @returns {AnalyticsRequest} A new instance of the class for chaining purposes
     *
     * @example
     * const req = new analytics.request()
     *    .fromVisualization(visualization);
     *
     * // dimension=pe:last_12_month&dimension=dx:fbfjhsppuqd;cyeuwxtcpku;jtf34knzhzp;hfdmmspbglg&filter=ou:imsptqpwcqd
     *
     * const req2 = new analytics.request()
     *    .fromvisualization(visualization, true);
     *
     * // dimension=pe:last_12_month&dimension=dx:fbfjhsppuqd;cyeuwxtcpku;jtf34knzhzp;hfdmmspbglg&dimension=ou:imsptqpwcqd
     */
    fromVisualization(visualization, passFilterAsDimension = false) {
        let request = this

        // extract dimensions from visualization
        const columns = visualization.columns || []
        const rows = visualization.rows || []

        columns.concat(rows).forEach((d) => {
            let dimension = d.dimension

            if (d.legendSet?.id) {
                dimension += `-${d.legendSet.id}`
            }

            // needed for ER ENROLLMENT
            if (d.programStage?.id) {
                dimension = `${d.programStage.id}.${dimension}`
            }

            if (d.filter) {
                dimension += `:${d.filter}`
            }

            request = request.addDimension(
                dimension,
                d.items?.map((item) => item.id)
            )
        })

        // extract filters from visualization
        const filters = visualization.filters || []

        // only pass dx/pe/ou as dimension
        const fixedIds = Object.keys(getFixedDimensions())

        filters.forEach((f) => {
            request =
                passFilterAsDimension && fixedIds.includes(f.dimension)
                    ? request.addDimension(
                          f.dimension,
                          f.items?.map((item) => item.id)
                      )
                    : request.addFilter(
                          f.dimension,
                          f.items?.map((item) => item.id)
                      )
        })

        return request
    }
}

export default AnalyticsRequest
