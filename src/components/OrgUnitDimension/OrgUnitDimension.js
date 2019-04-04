import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import i18n from '@dhis2/d2-i18n'
import {
    OrgUnitSelector,
    userOrgUnits,
    removeOrgUnitLastPathSegment,
} from '@dhis2/d2-ui-org-unit-dialog'

import {
    apiFetchOrganisationUnitGroups,
    apiFetchOrganisationUnitLevels,
    apiFetchOrganisationUnits,
} from '../../api/organisationUnits'

import {
    LEVEL_ID_PREFIX,
    GROUP_ID_PREFIX,
    isLevelId,
    isGroupId,
    getOrgUnitsFromIds,
    getLevelsFromIds,
    getGroupsFromIds,
    sortOrgUnitLevels,
} from '../../modules/orgUnitDimensions'

import { FIXED_DIMENSIONS } from '../../modules/fixedDimensions'
import styles from './styles/OrgUnitDimension.style'
import { colors } from '../../modules/colors'

const ouId = FIXED_DIMENSIONS.ou.id

export const defaultState = {
    root: undefined,
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
        this.userOrgUnitIds = userOrgUnits.map(orgUnit => orgUnit.id)

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

    addOrgUnitPathToParentGraphMap = orgUnit => {
        const path = removeOrgUnitLastPathSegment(orgUnit.path)

        this.props.acAddParentGraphMap({
            [orgUnit.id]: path[0] === '/' ? path.substr(1) : path,
        })
    }

    setOuUiItems = items => {
        this.props.onReorder({ dimensionType: ouId, value: items })
    }

    getUserOrgUnitsFromIds = ids => {
        return userOrgUnits.filter(orgUnit => ids.includes(orgUnit.id))
    }

    onLevelChange = event => {
        const levelIds = event.target.value.filter(id => !!id)

        this.setOuUiItems([
            ...this.props.ouItems.filter(ou => !isLevelId(ou.id)),
            ...levelIds.map(
                id =>
                    `${LEVEL_ID_PREFIX}-${
                        this.state.ouLevels.find(ou => ou.id === id).level
                    }`
            ),
        ])
    }

    onGroupChange = event => {
        const groupIds = event.target.value.filter(id => !!id)

        this.setOuUiItems([
            ...this.props.ouItems.filter(ou => !isGroupId(ou.id)),
            ...groupIds.map(id => `${GROUP_ID_PREFIX}-${id}`),
        ])
    }

    onDeselectAllClick = () =>
        this.props.onDeselect({
            dimensionType: ouId,
            value: this.props.ouItems.map(ou => ou.id),
        })

    loadOrgUnitTree = (d2, displayNameProperty) => {
        apiFetchOrganisationUnits(d2, displayNameProperty)
            .then(rootLevel => rootLevel.toArray()[0])
            .then(root => {
                this.setState({
                    root,
                })
            })
    }

    loadOrgUnitGroups = (d2, displayNameProperty) => {
        apiFetchOrganisationUnitGroups(d2, displayNameProperty).then(
            organisationUnitGroups =>
                this.setState({ ouGroups: organisationUnitGroups })
        )
    }

    loadOrgUnitLevels = d2 => {
        apiFetchOrganisationUnitLevels(d2).then(organisationUnitLevels =>
            /*
                transformOptionsIntoMetadata(
                    organisationUnitLevels,
                    this.props.metadata,
                    ['id', 'displayName', 'name', 'level']
                )
            )
            .then(({ options, metadata }) => {
                this.props.acAddMetadata(metadata);
                */
            this.setState({
                ouLevels: sortOrgUnitLevels(organisationUnitLevels),
            })
        )
    }

    handleOrgUnitClick = (event, orgUnit) => {
        console.log('click', orgUnit)
        const selected = this.props.ouItems

        if (selected.some(ou => ou.path === orgUnit.path)) {
            this.props.onDeselect({
                dimensionType: ouId,
                value: [orgUnit.id],
            })
        } else {
            this.props.onSelect({
                dimensionType: ouId,
                value: [
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

            this.setOuUiItems([
                ...this.props.ouItems.filter(ou =>
                    this.userOrgUnitIds.includes(ou.id)
                ),
                event.target.name,
            ])
        } else {
            if (
                this.props.ouItems.length === 1 &&
                this.state.selected.length > 0
            ) {
                this.setOuUiItems(this.state.selected)

                this.setState({
                    selected: [],
                })
            }

            this.props.onDeselect({
                dimensionType: ouId,
                value: [event.target.name],
            })
        }
    }

    handleMultipleOrgUnitsSelect = orgUnits => {
        console.log('multiple ou', orgUnits)
        /*
        orgUnits.forEach(orgUnit => {
            this.addOrgUnitPathToParentGraphMap(orgUnit);
        });*/

        this.props.onSelect({
            dimensionType: ouId,
            value: orgUnits.reduce(
                (obj, ou) =>
                    obj.push({ ...ou, name: ou.name || ou.displayName }),
                []
            ),
        })
    }

    render = () => {
        /*
        const ids = this.props.ouItems;
        const selected = getOrgUnitsFromIds(
            ids,
            this.props.metadata,
            //this.props.parentGraphMap,
            this.userOrgUnitIds
        );*/
        const selected = this.props.ouItems
        const ids = selected.map(ou => ou.id)
        const userOrgUnits = this.getUserOrgUnitsFromIds(ids)
        const level = getLevelsFromIds(ids, this.state.ouLevels)
        const group = getGroupsFromIds(ids, this.state.ouGroups)

        return (
            <Fragment>
                <DialogTitle>{i18n.t('Organisation units')}</DialogTitle>
                <DialogContent style={styles.dialogContent}>
                    {this.state.root && this.state.showOrgUnitsTree && (
                        <OrgUnitSelector
                            d2={this.props.d2}
                            root={this.state.root}
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
                        />
                    )}
                    {!this.state.root && (
                        <CircularProgress style={styles.loader} />
                    )}
                </DialogContent>
            </Fragment>
        )
    }
}

OrgUnitDimension.propTypes = {
    d2: PropTypes.object,
    displayNameProperty: PropTypes.string,
    onSelect: PropTypes.func,
    onDeselect: PropTypes.func,
    onReorder: PropTypes.func,

    ouItems: PropTypes.array,
    metadata: PropTypes.object,

    //parentGraphMap: PropTypes.object.isRequired,
    //acAddParentGraphMap: PropTypes.func.isRequired,
    //acSetCurrentFromUi: PropTypes.func.isRequired,
    current: PropTypes.object,
}

export default OrgUnitDimension
