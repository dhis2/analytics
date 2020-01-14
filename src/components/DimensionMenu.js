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
import { AXIS_ID_COLUMNS, AXIS_ID_FILTERS } from '../modules/layout/axis'
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

const getUnavailableLabel = visType =>
    i18n.t('Not available for {{visType}}', {
        visType: getDisplayNameByVisType(visType),
    })

const getDualAxisMenuItemLabel = (
    currentAxisId,
    visType,
    numberOfDimensionItems
) => {
    let label

    if (!isDualAxisType(visType)) {
        label = getUnavailableLabel(visType)
    } else if (numberOfDimensionItems < 2) {
        label = i18n.t('Requires 2 or more data items')
    } else if (currentAxisId !== AXIS_ID_COLUMNS) {
        label = i18n.t('Only available when data is in Series')
    }

    return label
}

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
            dualAxisItemHandler,
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

        const getDualAxisMenuItem = isDisabled => (
            <MenuItem
                key={`dual-axis-item-${dimensionId}`}
                onClick={() => {
                    dualAxisItemHandler()
                    closeWholeMenu()
                }}
                disabled={isDisabled}
            >
                <div>{i18n.t('Manage chart axes')}</div>
            </MenuItem>
        )

        // Create dual axis menu item
        if (dimensionId === DIMENSION_ID_DATA) {
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
                        placement="right-start"
                        classes={classes}
                    >
                        <div>{getDualAxisMenuItem(true)}</div>
                    </Tooltip>
                )
            }
            // divider
            if (applicableAxisIds.length) {
                menuItems.push(getDividerItem('dual-axis-item-divider'))
            }
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
                                        {i18n.t(
                                            `${getAxisItemLabelPrefix()} ${getAxisName(
                                                destination
                                            )}`
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
                        axisItemHandler(
                            dimensionId,
                            axisId,
                            numberOfDimensionItems
                        )
                        closeWholeMenu()
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
    dualAxisItemHandler: PropTypes.func,
    isAssignedCategoriesInLayout: PropTypes.bool,
    visType: PropTypes.string,
}

export default DimensionMenu
