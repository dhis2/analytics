import React from 'react'
import Divider from '@material-ui/core/Divider'
import Menu from '@material-ui/core/Menu'
import Zoom from '@material-ui/core/Zoom'

import { getAvailableAxes } from '../modules/layoutUiRules'
import { AXIS_NAME_COLUMNS } from '../modules/layout/axis'
import { DIMENSION_ID_DATA } from '../modules/fixedDimensions'
import { isDualAxisType } from '../modules/visTypes'

const shouldHaveDualAxis = ({
    dimensionId,
    currentAxisName,
    visType,
    numberOfDimensionItems,
}) =>
    Boolean(
        dimensionId === DIMENSION_ID_DATA &&
            currentAxisName === AXIS_NAME_COLUMNS &&
            isDualAxisType(visType) &&
            numberOfDimensionItems > 1
    )

const getDualAxisItem = (dimensionId, onClick) => (
    <MenuItem key={`dual-axis-${dimensionId}`} onClick={onClick}>
        {i18n.t('Manage axes')}
    </MenuItem>
)

const getAxisItemLabelPrefix = isDimensionInLayout =>
    isDimensionInLayout ? 'Move to' : 'Add to'

const getAxisItems = ({
    dimensionId,
    axisNames,
    isDimensionInLayout,
    onClick,
}) =>
    axisNames.map(axisName => (
        <MenuItem
            key={`${dimensionId}-to-${axisName}`}
            onClick={onClick(dimensionId, axisName)}
        >
            {i18n.t(
                `${getAxisItemLabelPrefix(isDimensionInLayout)} ${
                    menuLabels[axisName]
                }`
            )}
        </MenuItem>
    ))

const getRemoveMenuItem = (dimensionId, onRemove) => (
    <MenuItem key={`remove-${dimensionId}`} onClick={onRemove(dimensionId)}>
        {i18n.t('Remove')}
    </MenuItem>
)

const getDividerItem = key => <Divider light key={key} />

export const DimensionMenu = ({
    dimensionId,
    currentAxisName,
    visType,
    numberOfDimensionItems,
    dualAxisItemHandler,
    axisItemHandler,
    removeItemHandler,
    anchorEl,
    onClose,
}) => {
    const menuItems = []

    const isDimensionInLayout = !!currentAxisName

    // dual axis item
    const hasDualAxis = shouldHaveDualAxis({
        dimensionId,
        currentAxisName,
        visType,
        numberOfDimensionItems,
    })

    // add/move to axis item
    const availableAxisNames = getAvailableAxes(
        getLayoutTypeByChartType(visType)
    )

    const applicableAxisNames = availableAxisNames.filter(
        axisName => axisName !== currentAxisName
    )

    // create menu items
    if (hasDualAxis) {
        menuItems.push(getDualAxisItem(dimensionId, dualAxisItemHandler))

        // divider
        if (applicableAxisNames.length) {
            menuItems.push(getDividerItem('dual-axis-item-divider'))
        }
    }

    menuItems.push(
        ...axisNames.map(axisName =>
            getAxisItems({
                dimensionId,
                axisName,
                isDimensionInLayout,
                axisItemHandler,
            })
        )
    )

    // remove item
    if (isDimensionInLayout) {
        // divider
        if (applicableAxisNames.length) {
            menuItems.push(getDividerItem('remove-item-divider'))
        }

        menuItems.push(getRemoveMenuItem(dimensionId, removeItemHandler))
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
