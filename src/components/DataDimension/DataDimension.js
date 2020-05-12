import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import i18n from '@dhis2/d2-i18n'
import debounce from 'lodash/debounce'
import isEqual from 'lodash/isEqual'

import ItemSelector from '../ItemSelector/ItemSelector'
import DataTypes from './DataTypesSelector'
import Groups from './Groups'
import FilterField from '../FilterField'

import { apiFetchGroups, apiFetchAlternatives } from '../../api/dimensions'

import {
    DEFAULT_DATATYPE_ID,
    ALL_ID,
    dataTypes,
    defaultGroupId,
    defaultGroupDetail,
} from '../../modules/dataTypes'
import { DIMENSION_ID_DATA } from '../../modules/fixedDimensions'

import { styles } from './styles/DataDimension.style'

const FIRST_PAGE = 1

const DEFAULT_ALTERNATIVES = {
    dimensionItems: [],
    nextPage: FIRST_PAGE,
}

export class DataDimension extends Component {
    // defaults
    state = {
        dataType: DEFAULT_DATATYPE_ID,
        groups: {
            indicators: [],
            dataElements: [],
            dataElementOperands: [],
            dataSets: [],
            eventDataItems: [],
            programIndicators: [],
        },
        groupId: ALL_ID,
        groupDetail: '',
        filterText: '',
        items: [],
        itemsCopy: [],
        nextPage: null,
        filter: {},
    }

    componentDidMount() {
        this.updateGroups()
    }

    componentDidUpdate(prevProps) {
        const prevItems = prevProps.selectedDimensions
        const currentItems = this.props.selectedDimensions

        if (!isEqual(prevItems, currentItems)) {
            this.setState({
                items: this.state.itemsCopy.filter(
                    di => !currentItems.includes(di.id)
                ),
            })
        }
    }

    updateGroups = async () => {
        const dataType = this.state.dataType

        if (!this.state.groups[dataType].length) {
            const dataTypeGroups = await apiFetchGroups(
                this.props.d2,
                dataType,
                this.props.displayNameProp
            )

            const groups = Object.assign({}, this.state.groups, {
                [dataType]: dataTypeGroups,
            })
            this.setState({ groups }, this.updateAlternatives)
        } else {
            this.updateAlternatives()
        }
    }

    onDataTypeChange = dataType => {
        if (dataType !== this.state.dataType) {
            const filter = Object.assign({}, this.state.filter, {
                [this.state.dataType]: {
                    groupId: this.state.groupId,
                    groupDetail: this.state.groupDetail,
                },
            })

            const currentFilter = this.state.filter[dataType] || {}
            const groupId = currentFilter.groupId || defaultGroupId(dataType)
            const groupDetail =
                currentFilter.groupDetail || defaultGroupDetail(dataType)

            this.setState(
                {
                    filter,
                    dataType,
                    groupId,
                    groupDetail,
                    filterText: '',
                },
                this.updateGroups
            )
        }
    }

    requestMoreItems = () => {
        if (this.state.nextPage) {
            this.updateAlternatives(this.state.nextPage, true)
        }
    }

    updateAlternatives = async (page = FIRST_PAGE, concatItems = false) => {
        const { dataType, groupId, groupDetail, filterText } = this.state

        const { dimensionItems, nextPage } =
            (await apiFetchAlternatives({
                d2: this.props.d2,
                dataType,
                groupId,
                groupDetail,
                page,
                filterText,
                nameProp: this.props.displayNameProp,
            })) || DEFAULT_ALTERNATIVES

        const augmentFn = dataTypes[dataType].augmentAlternatives
        const augmentedDimensionItems = augmentFn
            ? augmentFn(dimensionItems, groupId)
            : dimensionItems

        const items = concatItems
            ? this.state.items.concat(augmentedDimensionItems)
            : augmentedDimensionItems

        this.setState({
            items: items.filter(
                di => !this.props.selectedDimensions.includes(di.id)
            ),
            itemsCopy: items,
            nextPage,
        })
    }

    onGroupChange = async groupId => {
        if (groupId !== this.state.groupId) {
            this.setState({ groupId }, this.updateAlternatives)
        }
    }

    onDetailChange = groupDetail => {
        if (groupDetail !== this.state.groupDetail) {
            this.setState({ groupDetail }, this.updateAlternatives)
        }
    }

    onClearFilter = () => {
        this.setState(
            { filterText: '' },
            debounce(async () => this.updateAlternatives(), 300)
        )
    }

    onFilterTextChange = filterText => {
        this.setState(
            { filterText },
            debounce(async () => this.updateAlternatives(), 300)
        )
    }

    selectItems = selectedIds => {
        const itemsToAdd = this.state.items.filter(di =>
            selectedIds.includes(di.id)
        )

        this.props.onSelect({
            dimensionId: DIMENSION_ID_DATA,
            items: [
                ...this.props.selectedDimensions.filter(
                    item => !selectedIds.includes(item.id)
                ),
                ...itemsToAdd,
            ],
        })
    }

    deselectItems = itemIdsToRemove => {
        this.props.onDeselect({
            dimensionId: DIMENSION_ID_DATA,
            itemIdsToRemove,
        })
    }

    reorderItems = itemIds =>
        this.props.onReorder({
            dimensionId: DIMENSION_ID_DATA,
            itemIds,
        })

    getUnselectedItems = () =>
        this.state.items.filter(
            item => !this.props.selectedDimensions.find(i => i.id === item.id)
        )

    render = () => {
        const groups = this.state.groups[this.state.dataType] || []

        const filterZone = () => {
            return (
                <div>
                    <DataTypes
                        currentDataType={this.state.dataType}
                        onDataTypeChange={this.onDataTypeChange}
                    />
                    <Groups
                        dataType={this.state.dataType}
                        groups={groups}
                        groupId={this.state.groupId}
                        onGroupChange={this.onGroupChange}
                        onDetailChange={this.onDetailChange}
                        detailValue={this.state.groupDetail}
                    />
                    <FilterField
                        text={this.state.filterText}
                        onFilterTextChange={this.onFilterTextChange}
                        onClearFilter={this.onClearFilter}
                    />
                </div>
            )
        }

        const unselected = {
            items: this.getUnselectedItems(),
            onSelect: this.selectItems,
            filterText: this.state.filterText,
            requestMoreItems: this.requestMoreItems,
        }

        const selected = {
            items: this.props.selectedDimensions,
            infoBoxMessage: this.props.infoBoxMessage,
            dialogId: DIMENSION_ID_DATA,
            onDeselect: this.deselectItems,
            onReorder: this.reorderItems,
        }

        return (
            <Fragment>
                <DialogTitle>{i18n.t('Data')}</DialogTitle>
                <DialogContent style={styles.dialogContent}>
                    <ItemSelector
                        itemClassName="data-dimension"
                        unselected={unselected}
                        selected={selected}
                    >
                        {filterZone()}
                    </ItemSelector>
                </DialogContent>
            </Fragment>
        )
    }
}

DataDimension.propTypes = {
    d2: PropTypes.object.isRequired,
    displayNameProp: PropTypes.string.isRequired,
    selectedDimensions: PropTypes.array.isRequired,
    infoBoxMessage: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    onDeselect: PropTypes.func.isRequired,
    onReorder: PropTypes.func.isRequired,
}

DataDimension.defaultProps = {
    selectedDimensions: [],
    onSelect: Function.prototype,
    onDeselect: Function.prototype,
    onReorder: Function.prototype,
}

export default DataDimension
