import {
    IconTable16,
    IconVisualizationArea16,
    IconVisualizationAreaStacked16,
    IconVisualizationBar16,
    IconVisualizationBarStacked16,
    IconVisualizationColumn16,
    IconVisualizationColumnMulti16,
    IconVisualizationColumnStacked16,
    IconVisualizationGauge16,
    IconVisualizationLine16,
    IconVisualizationLinelist16,
    IconVisualizationLineMulti16,
    IconVisualizationPie16,
    IconVisualizationRadar16,
    IconVisualizationScatter16,
    IconVisualizationSingleValue16,
    IconTable24,
    IconVisualizationArea24,
    IconVisualizationAreaStacked24,
    IconVisualizationBar24,
    IconVisualizationBarStacked24,
    IconVisualizationColumn24,
    IconVisualizationLinelist24,
    IconVisualizationColumnMulti24,
    IconVisualizationColumnStacked24,
    IconVisualizationGauge24,
    IconVisualizationLine24,
    IconVisualizationLineMulti24,
    IconVisualizationPie24,
    IconVisualizationRadar24,
    IconVisualizationScatter24,
    IconVisualizationSingleValue24,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    VIS_TYPE_LINE_LIST,
    VIS_TYPE_PIVOT_TABLE,
    VIS_TYPE_COLUMN,
    VIS_TYPE_STACKED_COLUMN,
    VIS_TYPE_BAR,
    VIS_TYPE_STACKED_BAR,
    VIS_TYPE_LINE,
    VIS_TYPE_AREA,
    VIS_TYPE_STACKED_AREA,
    VIS_TYPE_PIE,
    VIS_TYPE_RADAR,
    VIS_TYPE_GAUGE,
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_SINGLE_VALUE,
    VIS_TYPE_SCATTER,
} from '../modules/visTypes.js'

export const VisTypeIcon = ({ type, useSmall = false, ...props }) => {
    let VisIcon

    switch (type) {
        case VIS_TYPE_LINE_LIST: {
            VisIcon = useSmall
                ? IconVisualizationLinelist16
                : IconVisualizationLinelist24
            break
        }
        case VIS_TYPE_PIVOT_TABLE: {
            VisIcon = useSmall ? IconTable16 : IconTable24
            break
        }
        case VIS_TYPE_BAR: {
            VisIcon = useSmall ? IconVisualizationBar16 : IconVisualizationBar24
            break
        }
        case VIS_TYPE_STACKED_BAR: {
            VisIcon = useSmall
                ? IconVisualizationBarStacked16
                : IconVisualizationBarStacked24
            break
        }
        case VIS_TYPE_STACKED_COLUMN: {
            VisIcon = useSmall
                ? IconVisualizationColumnStacked16
                : IconVisualizationColumnStacked24
            break
        }
        case VIS_TYPE_LINE: {
            VisIcon = useSmall
                ? IconVisualizationLine16
                : IconVisualizationLine24
            break
        }
        case VIS_TYPE_AREA: {
            VisIcon = useSmall
                ? IconVisualizationArea16
                : IconVisualizationArea24
            break
        }
        case VIS_TYPE_STACKED_AREA: {
            VisIcon = useSmall
                ? IconVisualizationAreaStacked16
                : IconVisualizationAreaStacked24
            break
        }
        case VIS_TYPE_PIE: {
            VisIcon = useSmall ? IconVisualizationPie16 : IconVisualizationPie24
            break
        }
        case VIS_TYPE_RADAR: {
            VisIcon = useSmall
                ? IconVisualizationRadar16
                : IconVisualizationRadar24
            break
        }
        case VIS_TYPE_GAUGE: {
            VisIcon = useSmall
                ? IconVisualizationGauge16
                : IconVisualizationGauge24
            break
        }
        case VIS_TYPE_YEAR_OVER_YEAR_LINE: {
            VisIcon = useSmall
                ? IconVisualizationLineMulti16
                : IconVisualizationLineMulti24
            break
        }
        case VIS_TYPE_YEAR_OVER_YEAR_COLUMN: {
            VisIcon = useSmall
                ? IconVisualizationColumnMulti16
                : IconVisualizationColumnMulti24
            break
        }
        case VIS_TYPE_SINGLE_VALUE: {
            VisIcon = useSmall
                ? IconVisualizationSingleValue16
                : IconVisualizationSingleValue24
            break
        }
        case VIS_TYPE_SCATTER: {
            VisIcon = useSmall
                ? IconVisualizationScatter16
                : IconVisualizationScatter24
            break
        }
        case VIS_TYPE_COLUMN:
        default: {
            VisIcon = useSmall
                ? IconVisualizationColumn16
                : IconVisualizationColumn24
            break
        }
    }

    return <VisIcon {...props} />
}

VisTypeIcon.propTypes = {
    type: PropTypes.string,
    useSmall: PropTypes.bool,
}

export default VisTypeIcon
