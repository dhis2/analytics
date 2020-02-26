import PropTypes from 'prop-types'
import { getHeaderForDisplay } from '../../modules/pivotTable/getHeaderForDisplay'

export const PivotTableHeaderCell = ({
    axisClippingResult,
    index,
    level,
    getHeader,
    render,
    showHierarchy,
}) => {
    const header = getHeaderForDisplay({
        start: axisClippingResult.indices[0],
        count: axisClippingResult.indices.length,
        index,
        dimensionLevel: level,
        getHeader,
        showHierarchy,
    })

    return !header ? null : render(header)
}

PivotTableHeaderCell.propTypes = {
    axisClippingResult: PropTypes.object.isRequired,
    getHeader: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    render: PropTypes.func.isRequired,
    showHierarchy: PropTypes.bool.isRequired,
}
