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

const getRemoveMenuItem = onClick => (
    <MenuItem
        key="remove-menu-item"
        onClick={onClick}
        label={i18n.t('Remove')}
    />
)

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

    // Assigned categories
    if (dimensionId === DIMENSION_ID_DATA && assignedCategoriesItemHandler) {
        if (assignedCategoriesAvailableDestinations.length) {
            if (!isAssignedCategoriesInLayout) {
                menuItems.push(
                    <MenuItem
                        label={assignedCategoriesItemLabel}
                        key={`assigned-categories-item-${dimensionId}`}
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

    return <FlyoutMenu dense>{menuItems}</FlyoutMenu>
}

DimensionMenu.propTypes = {
    axisItemHandler: PropTypes.func.isRequired,
    numberOfDimensionItems: PropTypes.number.isRequired,
    removeItemHandler: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    assignedCategoriesItemHandler: PropTypes.func,
    classes: PropTypes.object,
    currentAxisId: PropTypes.string,
    dimensionId: PropTypes.string,
    isAssignedCategoriesInLayout: PropTypes.bool,
    visType: PropTypes.string,
}

export default DimensionMenu
