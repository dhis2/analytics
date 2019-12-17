import React from 'react'
import Divider from '@material-ui/core/Divider'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Zoom from '@material-ui/core/Zoom'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import Tooltip from '@material-ui/core/Tooltip'

import { getAvailableAxes } from '../modules/layoutUiRules'
import { AXIS_ID_COLUMNS } from '../modules/layout/axis'
import { DIMENSION_ID_DATA } from '../modules/fixedDimensions'
import { isDualAxisType, getDisplayNameByVisType } from '../modules/visTypes'
import { getAxisName } from '../modules/axis'

const getAxisItemLabelPrefix = isDimensionInLayout =>
    isDimensionInLayout ? 'Move to' : 'Add to'

const getRemoveMenuItem = onClick => (
    <MenuItem key="remove-menu-item" onClick={onClick}>
        {i18n.t('Remove')}
    </MenuItem>
)

const getDividerItem = key => <Divider light key={key} />

const getDualAxisMenuItemLabel = (
    currentAxisId,
    visType,
    numberOfDimensionItems
) => {
    let label

    if (!isDualAxisType(visType)) {
        label = i18n.t('Not available for {{visType}}', {
            visType: getDisplayNameByVisType(visType),
        })
    } else if (numberOfDimensionItems < 2) {
        label = i18n.t('Requires 2 or more data items')
    } else if (currentAxisId !== AXIS_ID_COLUMNS) {
        label = i18n.t('Only available when data is in Series')
    }

    return label
}

export const DimensionMenu = ({
    dimensionId,
    currentAxisId,
    visType,
    numberOfDimensionItems,
    assignedCategoriesItemHandler,
    dualAxisItemHandler,
    axisItemHandler,
    removeItemHandler,
    anchorEl,
    onClose,
}) => {
    const menuItems = []

    const isDimensionInLayout = !!currentAxisId

    // add/move to axis item
    const availableAxisIds = getAvailableAxes(visType)

    const applicableAxisIds = availableAxisIds.filter(
        axisId => axisId !== currentAxisId
    )

    const getDualAxisMenuItem = isDisabled => (
        <MenuItem
            key={`dual-axis-item-${dimensionId}`}
            onClick={() => {
                dualAxisItemHandler()
                onClose()
            }}
            disabled={isDisabled}
        >
            <div>{i18n.t('Manage chart axes')}</div>
        </MenuItem>
    )

    const getAssignedCategoriesItem = isDisabled => (
        <MenuItem
            key={`assigned-categories-item-${dimensionId}`}
            onClick={() => {
                assignedCategoriesItemHandler()
                onClose()
            }}
            disabled={isDisabled}
        >
            <div>{i18n.t('Include categories in layout')}</div>
        </MenuItem>
    )

    // Create dual axis menu item & assigned categories
    if (dimensionId === DIMENSION_ID_DATA) {
        // Dual axis
        if (
            currentAxisId === AXIS_ID_COLUMNS &&
            isDualAxisType(visType) &&
            numberOfDimensionItems >= 2
        ) {
            menuItems.push(getDualAxisMenuItem(false))
        } else {
            const label = getDualAxisMenuItemLabel(
                currentAxisId,
                visType,
                numberOfDimensionItems
            )
            menuItems.push(
                <Tooltip
                    key={`dual-axis-tooltip-${dimensionId}`}
                    title={label}
                    aria-label="disabled"
                    placement="top-start"
                >
                    <div>{getDualAxisMenuItem(true)}</div>
                </Tooltip>
            )
        }

        // Assigned categories
        if (numberOfDimensionItems > 0) {
            menuItems.push(getAssignedCategoriesItem(false))
        } else {
            menuItems.push(
                <Tooltip
                    key={`assigned-categories-tooltip-${dimensionId}`}
                    title={i18n.t(
                        'Only available when data elements are selected'
                    )}
                    aria-label="disabled"
                    placement="top-start"
                >
                    <div>{getAssignedCategoriesItem(true)}</div>
                </Tooltip>
            )
        }

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
    assignedCategoriesItemHandler: PropTypes.func.isRequired,
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
