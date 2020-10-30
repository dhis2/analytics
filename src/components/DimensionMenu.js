import React from 'react'
import { MenuDivider, FlyoutMenu, MenuItem, Tooltip } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'

import { getAvailableAxes } from '../modules/layoutUiRules'
import { AXIS_ID_FILTERS } from '../modules/layout/axis'
import {
    DIMENSION_ID_DATA,
    getPredefinedDimensionProp,
    DIMENSION_PROP_NO_ITEMS,
} from '../modules/predefinedDimensions'
import { getDisplayNameByVisType } from '../modules/visTypes'
import { getAxisNameByLayoutType } from '../modules/axis'
import { getLayoutTypeByVisType } from '../modules/visTypeToLayoutType'

const getAxisItemLabel = (axisName, isDimensionInLayout) =>
    isDimensionInLayout
        ? i18n.t('Move to {{axisName}}', { axisName })
        : i18n.t('Add to {{axisName}}', { axisName })

const getDividerItem = key => <MenuDivider dense key={key} />

const getUnavailableLabel = visType =>
    i18n.t('Not available for {{visualizationType}}', {
        visualizationType: getDisplayNameByVisType(visType),
    })

const DimensionMenu = ({
    dimensionId,
    currentAxisId,
    visType,
    numberOfDimensionItems,
    assignedCategoriesItemHandler,
    isAssignedCategoriesInLayout,
    axisItemHandler,
    removeItemHandler,
    classes,
    onClose,
    dataTest,
}) => {
    const menuItems = []

    const isDimensionInLayout = !!currentAxisId

    // add/move to axis item
    const availableAxisIds = getAvailableAxes(visType)

    const applicableAxisIds = availableAxisIds.filter(
        axisId => axisId !== currentAxisId
    )

    const assignedCategoriesAvailableDestinations = getAvailableAxes(
        visType
    ).filter(axis => axis !== AXIS_ID_FILTERS)

    const assignedCategoriesItemLabel = isAssignedCategoriesInLayout
        ? i18n.t('Remove Assigned Categories')
        : i18n.t('Add Assigned Categories')

    const getRemoveMenuItem = onClick => (
        <MenuItem
            key="remove-menu-item"
            onClick={onClick}
            label={i18n.t('Remove')}
            dataTest={`${dataTest}-item-remove-${dimensionId}`}
        />
    )

    // Assigned categories
    if (dimensionId === DIMENSION_ID_DATA && assignedCategoriesItemHandler) {
        if (assignedCategoriesAvailableDestinations.length) {
            if (!isAssignedCategoriesInLayout) {
                menuItems.push(
                    <MenuItem
                        label={assignedCategoriesItemLabel}
                        key={`assigned-categories-item-${dimensionId}`}
                        dataTest={`${dataTest}-item-assigned-categories-menu`}
                    >
                        {assignedCategoriesAvailableDestinations.map(
                            destination => (
                                <MenuItem
                                    key={destination}
                                    onClick={() => {
                                        assignedCategoriesItemHandler(
                                            destination
                                        )
                                        onClose()
                                    }}
                                    label={getAxisItemLabel(
                                        getAxisNameByLayoutType(
                                            destination,
                                            getLayoutTypeByVisType(visType)
                                        )
                                    )}
                                    dataTest={`${dataTest}-item-action-assigned-categories-to-${destination}`}
                                />
                            )
                        )}
                    </MenuItem>
                )
            } else {
                menuItems.push(
                    <MenuItem
                        key={`assigned-categories-item-${dimensionId}`}
                        onClick={() => {
                            assignedCategoriesItemHandler()
                            onClose()
                        }}
                        label={assignedCategoriesItemLabel}
                        dataTest={`${dataTest}-item-remove-assigned-categories`}
                    />
                )
            }
        } else {
            menuItems.push(
                <Tooltip
                    key={`assigned-categories-item-${dimensionId}`}
                    content={getUnavailableLabel(visType)}
                    aria-label="disabled"
                    classes={classes}
                >
                    <MenuItem
                        disabled
                        dense
                        label={assignedCategoriesItemLabel}
                        dataTest={`${dataTest}-item-assigned-categories-menu`}
                    />
                </Tooltip>
            )
        }
    }

    // divider
    menuItems.length &&
        menuItems.push(getDividerItem('assigned-categories-divider'))

    menuItems.push(
        ...applicableAxisIds.map(axisId => (
            <MenuItem
                key={`${dimensionId}-to-${axisId}`}
                onClick={() => {
                    axisItemHandler({
                        dimensionId,
                        axisId,
                        numberOfDimensionItems,
                        requireItems: !getPredefinedDimensionProp(
                            dimensionId,
                            DIMENSION_PROP_NO_ITEMS
                        ),
                        isDimensionInLayout,
                    })
                    onClose()
                }}
                label={getAxisItemLabel(
                    getAxisNameByLayoutType(
                        axisId,
                        getLayoutTypeByVisType(visType)
                    ),
                    isDimensionInLayout
                )}
                dataTest={`${dataTest}-item-action-${dimensionId}-to-${axisId}`}
            />
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
        <FlyoutMenu dense dataTest={dataTest}>
            {menuItems}
        </FlyoutMenu>
    )
}

DimensionMenu.propTypes = {
    axisItemHandler: PropTypes.func.isRequired,
    numberOfDimensionItems: PropTypes.number.isRequired,
    removeItemHandler: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    assignedCategoriesItemHandler: PropTypes.func,
    classes: PropTypes.object,
    currentAxisId: PropTypes.string,
    dataTest: PropTypes.string,
    dimensionId: PropTypes.string,
    isAssignedCategoriesInLayout: PropTypes.bool,
    visType: PropTypes.string,
}

export default DimensionMenu
