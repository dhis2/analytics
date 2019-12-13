import React, { useState } from 'react'
import Divider from '@material-ui/core/Divider'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Zoom from '@material-ui/core/Zoom'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'

import { getAvailableAxes } from '../modules/layoutUiRules'
import { AXIS_ID_COLUMNS } from '../modules/layout/axis'
import { DIMENSION_ID_DATA } from '../modules/fixedDimensions'
import { isDualAxisType } from '../modules/visTypes'
import { getAxisName } from '../modules/axis'
import { styles } from './DimensionsPanel/List/styles/RecommendedIcon.style' //TODO: Create own styles file

const canHaveDualAxisOption = (dimensionId, currentAxisId, visType) =>
    Boolean(
        dimensionId === DIMENSION_ID_DATA &&
            currentAxisId === AXIS_ID_COLUMNS &&
            isDualAxisType(visType)
    )

const getAxisItemLabelPrefix = isDimensionInLayout =>
    isDimensionInLayout ? 'Move to' : 'Add to'

const getRemoveMenuItem = onClick => (
    <MenuItem key="remove-menu-item" onClick={onClick}>
        {i18n.t('Remove')}
    </MenuItem>
)

const getDividerItem = key => <Divider light key={key} />

export const DimensionMenu = ({
    dimensionId,
    currentAxisId,
    visType,
    numberOfDimensionItems,
    dualAxisItemHandler,
    axisItemHandler,
    removeItemHandler,
    anchorEl,
    onClose,
}) => {
    const [tooltipAnchorEl, setTooltipAnchorEl] = useState(null)

    const menuItems = []

    const isDimensionInLayout = !!currentAxisId

    // add/move to axis item
    const availableAxisIds = getAvailableAxes(visType)

    const applicableAxisIds = availableAxisIds.filter(
        axisId => axisId !== currentAxisId
    )

    // create menu items
    if (canHaveDualAxisOption(dimensionId, currentAxisId, visType)) {
        menuItems.push(
            <MenuItem
                key={`dual-axis-${dimensionId}`}
                onClick={() => {
                    dualAxisItemHandler()
                    onClose()
                }}
                onMouseOver={() => setTooltipAnchorEl(event.currentTarget)}
                onMouseLeave={() => setTooltipAnchorEl(null)}
                disabled={numberOfDimensionItems <= 1}
            >
                {i18n.t('Manage axes')}
                {tooltipAnchorEl && (
                    <Popper
                        anchorEl={tooltipAnchorEl}
                        open={Boolean(tooltipAnchorEl)}
                        placement="bottom"
                    >
                        <Paper style={styles.toolTip}>
                            {i18n.t('Requires 2 or more data items')}
                        </Paper>
                    </Popper>
                )}
            </MenuItem>
        )

        // divider
        if (applicableAxisIds.length) {
            menuItems.push(getDividerItem('dual-axis-item-divider'))
        }
    }

    menuItems.push(
        ...applicableAxisIds.map(axisId => (
            <MenuItem
                key={`${dimensionId}-to-${axisId}`}
                onClick={() => {
                    axisItemHandler(dimensionId, axisId, numberOfDimensionItems)
                    onClose()
                }}
            >
                {i18n.t(
                    `${getAxisItemLabelPrefix(
                        isDimensionInLayout
                    )} ${getAxisName(axisId)}`
                )}
            </MenuItem>
        ))
    )

    // remove item
    if (isDimensionInLayout) {
        // divider
        if (applicableAxisIds.length) {
            menuItems.push(getDividerItem('remove-item-divider'))
        }

        menuItems.push(
            getRemoveMenuItem(() => {
                removeItemHandler(dimensionId)
                onClose()
            })
        )
    }

    return (
        <Menu
            id={dimensionId}
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

DimensionMenu.propTypes = {
    axisItemHandler: PropTypes.func.isRequired,
    dualAxisItemHandler: PropTypes.func.isRequired,
    numberOfDimensionItems: PropTypes.number.isRequired,
    removeItemHandler: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    anchorEl: PropTypes.object,
    currentAxisId: PropTypes.string,
    dimensionId: PropTypes.string,
    visType: PropTypes.string,
}

export default DimensionMenu
