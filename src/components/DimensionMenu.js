import React from 'react'
import Divider from '@material-ui/core/Divider'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Zoom from '@material-ui/core/Zoom'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'

import { getAvailableAxes } from '../modules/layoutUiRules'
import { AXIS_ID_COLUMNS } from '../modules/layout/axis'
import { DIMENSION_ID_DATA } from '../modules/fixedDimensions'
import { isDualAxisType } from '../modules/visTypes'
import { axisDisplayNames } from '../modules/axis'

export const shouldHaveDualAxisOption = ({
    dimensionId,
    currentAxisId,
    visType,
    numberOfDimensionItems,
}) =>
    Boolean(
        dimensionId === DIMENSION_ID_DATA &&
            currentAxisId === AXIS_ID_COLUMNS &&
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

const getAxisItem = ({ dimensionId, axisId, isDimensionInLayout, onClick }) => (
    <MenuItem key={`${dimensionId}-to-${axisId}`} onClick={onClick}>
        {i18n.t(
            `${getAxisItemLabelPrefix(isDimensionInLayout)} ${
                axisDisplayNames[axisId]
            }`
        )}
    </MenuItem>
)

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
    const menuItems = []

    const isDimensionInLayout = !!currentAxisId

    // dual axis item
    const hasDualAxis = shouldHaveDualAxisOption({
        dimensionId,
        currentAxisId,
        visType,
        numberOfDimensionItems,
    })

    // add/move to axis item
    const availableAxisIds = getAvailableAxes(visType)

    const applicableAxisIds = availableAxisIds.filter(
        axisId => axisId !== currentAxisId
    )

    // create menu items
    if (hasDualAxis) {
        menuItems.push(
            getDualAxisItem(dimensionId, () => {
                dualAxisItemHandler()
                onClose()
            })
        )

        // divider
        if (applicableAxisIds.length) {
            menuItems.push(getDividerItem('dual-axis-item-divider'))
        }
    }

    menuItems.push(
        ...applicableAxisIds.map(axisId =>
            getAxisItem({
                dimensionId,
                axisId,
                isDimensionInLayout,
                onClick: () => {
                    axisItemHandler(dimensionId, axisId, numberOfDimensionItems)
                    onClose()
                },
            })
        )
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
    dimensionId: PropTypes.string,
    currentAxisId: PropTypes.string,
    visType: PropTypes.string,
    numberOfDimensionItems: PropTypes.number.isRequired,
    dualAxisItemHandler: PropTypes.func.isRequired,
    axisItemHandler: PropTypes.func.isRequired,
    removeItemHandler: PropTypes.func.isRequired,
    anchorEl: PropTypes.object,
    onClose: PropTypes.func.isRequired,
}

export default DimensionMenu
