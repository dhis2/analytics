import React from 'react'
import PropTypes from 'prop-types'
import Menu from '@material-ui/core/Menu'
import Zoom from '@material-ui/core/Zoom'

import { getAvailableAxes } from '../modules/layoutUiRules'

export const DimensionMenu = ({
    dimensionId,
    currentAxisName,
    visType,
    anchorEl,
    onClose,
}) => {
    let axes = getAvailableAxes(getLayoutTypeByChartType(visType))

    if (currentAxisName) {
        axes = axes.filter(axis => axis !== currentAxisName)
        axes.push('remove')
    }

    // [columns, rows, remove]

    return (
        <Menu
            id={id}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
            onExited={onClose}
            transitionDuration={{ enter: 50, exit: 0 }}
            TransitionComponent={Zoom}
        >
            {menuItems}
        </Menu>
    )
}
