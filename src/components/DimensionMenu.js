import React, { Component } from 'react'
import Divider from '@material-ui/core/Divider'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import Zoom from '@material-ui/core/Zoom'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import Tooltip from '@material-ui/core/Tooltip'

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
    <MenuItem key="remove-menu-item" onClick={onClick}>
        {i18n.t('Remove')}
    </MenuItem>
)

const getDividerItem = key => <Divider light key={key} />

const getUnavailableLabel = visType =>
    i18n.t('Not available for {{visualizationType}}', {
        visualizationType: getDisplayNameByVisType(visType),
    })

export class DimensionMenu extends Component {
    state = { submenuAnchorEl: null }
    render() {
        const {
            dimensionId,
            currentAxisId,
            visType,
            numberOfDimensionItems,
            assignedCategoriesItemHandler,
            isAssignedCategoriesInLayout,
            axisItemHandler,
            removeItemHandler,
            anchorEl,
            onClose,
            classes,
        } = this.props

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

        const closeSubMenu = () => {
            this.setState({
                submenuAnchorEl: null,
            })
        }

        const closeWholeMenu = () => {
            onClose()
            closeSubMenu()
        }

        // divider
        if (applicableAxisIds.length) {
            menuItems.push(getDividerItem('dual-axis-item-divider'))
        }

        // Assigned categories
        if (
            dimensionId === DIMENSION_ID_DATA &&
            assignedCategoriesItemHandler
        ) {
            if (assignedCategoriesAvailableDestinations.length) {
                if (!isAssignedCategoriesInLayout) {
                    menuItems.push(
                        <MenuItem
                            key={`assigned-categories-item-${dimensionId}`}
                            onClick={event =>
                                this.setState({
                                    submenuAnchorEl: event.currentTarget,
                                })
                            }
                        >
                            <div>{assignedCategoriesItemLabel}</div>
                            <ArrowRightIcon />
                        </MenuItem>
                    )

                    menuItems.push(
                        <Menu
                            key={`assigned-categories-sub-menu-${dimensionId}`}
                            open={Boolean(this.state.submenuAnchorEl)}
                            anchorEl={this.state.submenuAnchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            onClose={closeSubMenu}
                            onExited={closeSubMenu}
                        >
                            {assignedCategoriesAvailableDestinations.map(
                                destination => (
                                    <MenuItem
                                        key={destination}
                                        onClick={() => {
                                            assignedCategoriesItemHandler(
                                                destination
                                            )
                                            closeWholeMenu()
                                        }}
                                    >
                                        {getAxisItemLabel(
                                            getAxisNameByLayoutType(
                                                destination,
                                                getLayoutTypeByVisType(visType)
                                            )
                                        )}
                                    </MenuItem>
                                )
                            )}
                        </Menu>
                    )
                } else {
                    menuItems.push(
                        <MenuItem
                            key={`assigned-categories-item-${dimensionId}`}
                            onClick={() => {
                                assignedCategoriesItemHandler()
                                closeWholeMenu()
                            }}
                        >
                            <div>{assignedCategoriesItemLabel}</div>
                        </MenuItem>
                    )
                }
            } else {
                menuItems.push(
                    <Tooltip
                        key={`assigned-categories-item-${dimensionId}`}
                        title={getUnavailableLabel(visType)}
                        aria-label="disabled"
                        placement="right-start"
                        classes={classes}
                    >
                        <div>
                            <MenuItem disabled>
                                <div>{assignedCategoriesItemLabel}</div>
                                <ArrowRightIcon />
                            </MenuItem>
                        </div>
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
                        closeWholeMenu()
                    }}
                >
                    {getAxisItemLabel(
                        getAxisNameByLayoutType(
                            axisId,
                            getLayoutTypeByVisType(visType)
                        ),
                        isDimensionInLayout
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
                    closeWholeMenu()
                })
            )
        }

        return (
            <Menu
                id={dimensionId}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeWholeMenu}
                onExited={closeWholeMenu}
                transitionDuration={{ enter: 50, exit: 0 }}
                TransitionComponent={Zoom}
            >
                {menuItems}
            </Menu>
        )
    }
}

DimensionMenu.propTypes = {
    axisItemHandler: PropTypes.func.isRequired,
    numberOfDimensionItems: PropTypes.number.isRequired,
    removeItemHandler: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    anchorEl: PropTypes.object,
    assignedCategoriesItemHandler: PropTypes.func,
    classes: PropTypes.object,
    currentAxisId: PropTypes.string,
    dimensionId: PropTypes.string,
    isAssignedCategoriesInLayout: PropTypes.bool,
    visType: PropTypes.string,
}

export default DimensionMenu
