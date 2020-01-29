import PropTypes from 'prop-types'
import { getHeaderForDisplay } from '../../modules/pivotTable/getHeaderForDisplay'

export const PivotTableHeaderCell = ({
    axisClippingResult,
    index,
    level,
    getHeader,
    render,
}) => {
    const header = getHeaderForDisplay({
        start: axisClippingResult.indices[0],
        count: axisClippingResult.indices.length,
        index,
        dimensionLevel: level,
        getHeader,
    })
    return !header ? null : render(header)
}

PivotTableHeaderCell.propTypes = {
    clippingResult: PropTypes.object.isRequired,
    getHeader: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    render: PropTypes.func.isRequired,
}
