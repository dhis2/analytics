import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import sortBy from 'lodash/sortBy'
import { OrgUnitSelector, userOrgUnits } from '@dhis2/d2-ui-org-unit-dialog'
import { CircularLoader } from '@dhis2/ui-core'

import {
    apiFetchOrganisationUnitGroups,
    apiFetchOrganisationUnitLevels,
    apiFetchOrganisationUnits,
} from '../../api/organisationUnits'
import { ouIdHelper } from '../../modules/ouIdHelper'
import { DIMENSION_ID_ORGUNIT } from '../../modules/predefinedDimensions'
import styles from './styles/OrgUnitDimension.module.css'
import { colors } from '../../modules/colors'

export const defaultState = {
    root: undefined,
    roots: undefined,
    // use "selected" property for cloning org units while user org unit(s) is (are) selected
    selected: [],
    ouLevels: [],
    ouGroups: [],
    showOrgUnitsTree: true,
}

class OrgUnitDimension extends Component {
    constructor(props) {
        super(props)

        this.state = defaultState
        this.userOrgUnitIds = userOrgUnits.map(ou => ou.id)

        this.loadOrgUnitTree(props.d2, props.displayNameProperty)
        this.loadOrgUnitGroups(props.d2, props.displayNameProperty)
        this.loadOrgUnitLevels(props.d2)
    }

    componentDidUpdate(prevProps) {
        const previousId = prevProps.current ? prevProps.current.id : null
        const currentId = this.props.current ? this.props.current.id : null

        // remount org units selector component to ensure
        // only selected org units are expanded
        if (previousId !== currentId) {
            this.hideOrgUnitsTree()

            setTimeout(this.showOrgUnitsTree, 0)
        }
    }

    showOrgUnitsTree = () => {
        this.setState({ showOrgUnitsTree: true })
    }

    hideOrgUnitsTree = () => {
        this.setState({ showOrgUnitsTree: false })
    }

    getUserOrgUnitsFromIds = ids => {
        return userOrgUnits.filter(ou => ids.includes(ou.id))
    }

    onLevelChange = event => {
        const levelIds = event.target.value.filter(id => !!id)

        this.props.onSelect({
            dimensionId: DIMENSION_ID_ORGUNIT,
            items: [
                ...this.props.ouItems.filter(
                    ou => !ouIdHelper.hasLevelPrefix(ou.id)
                ),
                ...levelIds.map(id => {
                    const levelOu = this.state.ouLevels.find(ou => ou.id === id)

                    return {
                        ...levelOu,
                        id: ouIdHelper.addLevelPrefix(levelOu.id),
                    }
                }),
            ],
        })
    }

    onGroupChange = event => {
        const groupIds = event.target.value.filter(id => !!id)

        this.props.onSelect({
            dimensionId: DIMENSION_ID_ORGUNIT,
            items: [
                ...this.props.ouItems.filter(
                    ou => !ouIdHelper.hasGroupPrefix(ou.id)
                ),
                ...groupIds.map(id => {
                    const groupOu = this.state.ouGroups.find(ou => ou.id === id)

                    return {
                        ...groupOu,
                        id: ouIdHelper.addGroupPrefix(id),
                    }
                }),
            ],
        })
    }

    onDeselectAllClick = () =>
        this.props.onDeselect({
            dimensionId: DIMENSION_ID_ORGUNIT,
            itemIdsToRemove: this.props.ouItems.map(ou => ou.id),
        })

    loadOrgUnitTree = (d2, displayNameProperty) => {
        apiFetchOrganisationUnits(d2, displayNameProperty)
            .then(rootLevel => rootLevel.toArray())
            .then(roots => {
                this.setState({
                    roots,
                    root: roots[0],
                })
            })
    }

    loadOrgUnitGroups = (d2, displayNameProperty) => {
        apiFetchOrganisationUnitGroups(
            d2,
            displayNameProperty
        ).then(organisationUnitGroups =>
            this.setState({ ouGroups: organisationUnitGroups })
        )
    }

    loadOrgUnitLevels = d2 => {
        apiFetchOrganisationUnitLevels(d2).then(organisationUnitLevels =>
            this.setState({
                ouLevels: sortBy(organisationUnitLevels, ['level']),
            })
        )
    }

    handleOrgUnitClick = (event, orgUnit) => {
        const selected = this.props.ouItems

        if (selected.some(ou => ou.path === orgUnit.path)) {
            this.props.onDeselect({
                dimensionId: DIMENSION_ID_ORGUNIT,
                itemIdsToRemove: [orgUnit.id],
            })
        } else {
            this.props.onSelect({
                dimensionId: DIMENSION_ID_ORGUNIT,
                items: [
                    ...selected,
                    {
                        ...orgUnit,
                        name: orgUnit.name || orgUnit.displayName,
                    },
                ],
            })
        }
    }

    handleUserOrgUnitClick = (event, checked) => {
        if (checked) {
            if (!this.state.selected.length) {
                this.setState({
                    selected: this.props.ouItems.slice(),
                })
            }

            this.props.onSelect({
                dimensionId: DIMENSION_ID_ORGUNIT,
                items: [
                    ...this.props.ouItems.filter(ou =>
                        this.userOrgUnitIds.includes(ou.id)
                    ),
                    userOrgUnits.find(ou => ou.id === event.target.name),
                ],
            })
        } else {
            if (
                this.props.ouItems.length === 1 &&
                this.state.selected.length > 0
            ) {
                this.props.onSelect({
                    dimensionId: DIMENSION_ID_ORGUNIT,
                    items: this.state.selected,
                })
            } else {
                this.props.onDeselect({
                    dimensionId: DIMENSION_ID_ORGUNIT,
                    itemIdsToRemove: [event.target.name],
                })
            }
        }
    }

    handleMultipleOrgUnitsSelect = orgUnits => {
        const selected = this.props.ouItems

        this.props.onSelect({
            dimensionId: DIMENSION_ID_ORGUNIT,
            items: [
                ...selected,
                ...orgUnits.reduce((obj, ou) => {
                    // avoid duplicates when clicking "Select children" multiple times
                    if (!selected.find(i => i.id === ou.id)) {
                        obj.push({ ...ou, name: ou.name || ou.displayName })
                    }

                    return obj
                }, []),
            ],
        })
    }

    render = () => {
        const ids = this.props.ouItems.map(ou => ou.id)
        const selected = this.props.ouItems.filter(
            ou =>
                !this.userOrgUnitIds.includes(ou.id) &&
                !ouIdHelper.hasLevelPrefix(ou.id) &&
                !ouIdHelper.hasGroupPrefix(ou.id)
        )

        const userOrgUnits = this.getUserOrgUnitsFromIds(ids)
        const level = ids
            .filter(ouIdHelper.hasLevelPrefix)
            .map(ouIdHelper.removePrefix)
        const group = ids
            .filter(ouIdHelper.hasGroupPrefix)
            .map(ouIdHelper.removePrefix)

        return (
            <Fragment>
                {this.state.root && this.state.showOrgUnitsTree && (
                    <OrgUnitSelector
                        d2={this.props.d2}
                        root={this.state.root}
                        roots={this.state.roots}
                        selected={selected}
                        userOrgUnits={userOrgUnits}
                        level={level}
                        group={group}
                        levelOptions={this.state.ouLevels}
                        groupOptions={this.state.ouGroups}
                        onLevelChange={this.onLevelChange}
                        onGroupChange={this.onGroupChange}
                        onDeselectAllClick={this.onDeselectAllClick}
                        handleUserOrgUnitClick={this.handleUserOrgUnitClick}
                        handleOrgUnitClick={this.handleOrgUnitClick}
                        handleMultipleOrgUnitsSelect={
                            this.handleMultipleOrgUnitsSelect
                        }
                        checkboxColor="secondary"
                        deselectAllTooltipFontColor={colors.black}
                        deselectAllTooltipBackgroundColor={colors.greyLight}
                        displayNameProperty={this.props.displayNameProperty}
                        isUserDataViewFallback={true}
                    />
                )}
                {!this.state.root && <CircularLoader style={styles.loader} />}
            </Fragment>
        )
    }
}

OrgUnitDimension.propTypes = {
    current: PropTypes.object,
    d2: PropTypes.object,
    displayNameProperty: PropTypes.string,
    ouItems: PropTypes.array,
    onDeselect: PropTypes.func,
    onSelect: PropTypes.func,
}

export default OrgUnitDimension
