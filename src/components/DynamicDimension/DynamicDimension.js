import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ItemSelector from '../ItemSelector/ItemSelector'
import FilterField from '../FilterField'
import { apiFetchItemsByDimension } from '../../api/dimensions'

export class DynamicDimension extends Component {
    state = {
        filterText: '',
        nextPage: null,
        items: [],
        unselectedIds: [],
        selectedIds: [],
    }

    componentDidMount = async () => {
        const items = await apiFetchItemsByDimension(
            this.props.d2,
            this.props.dialogId
        )

        this.setState({ items })
    }

    onClearFilter = () => {
        this.setState({ filterText: '' })
    }

    onFilterTextChange = filterText => {
        const filteredItems = this.state.items.map(
            item =>
                item.name.toLowerCase().includes(filterText.toLowerCase()) &&
                item.id
        )

        this.setState({
            filterText,
            unselectedIds: filteredItems,
        })
    }

    selectItems = selectedIds => {
        const unselectedIds = this.state.unselectedIds.filter(
            id => !selectedIds.includes(id)
        )
        this.setState({ unselectedIds })

        const itemsToAdd = this.state.items.filter(di =>
            selectedIds.includes(di.id)
        )

        this.props.onSelect({
            dimensionId: this.props.dialogId,
            items: [
                ...this.props.selectedItems.filter(
                    item => !selectedIds.includes(item.id)
                ),
                ...itemsToAdd,
            ],
        })
    }

    deselectItems = ids => {
        const unselectedIds = [
            ...new Set([...this.state.unselectedIds, ...ids]),
        ]
        this.setState({ unselectedIds })

        this.props.onDeselect({
            dimensionId: this.props.dialogId,
            itemIdsToRemove: ids,
        })
    }

    reorderItems = itemIds =>
        this.props.onReorder({
            dimensionId: this.props.dialogId,
            itemIds,
        })

    getUnselectedItems = () =>
        this.state.items.filter(
            item => !this.props.selectedItems.find(i => i.id === item.id)
        )

    render = () => {
        const filterZone = () => {
            return (
                <FilterField
                    text={this.state.filterText}
                    onFilterTextChange={this.onFilterTextChange}
                    onClearFilter={this.onClearFilter}
                />
            )
        }

        const unselected = {
            items: this.getUnselectedItems(),
            onSelect: this.selectItems,
            filterText: this.state.filterText,
        }

        const selected = {
            items: this.props.selectedItems,
            dialogId: this.props.dialogId,
            onDeselect: this.deselectItems,
            onReorder: this.reorderItems,
        }

        return (
            <ItemSelector
                itemClassName="dynamic-dimension"
                unselected={unselected}
                selected={selected}
            >
                {filterZone()}
            </ItemSelector>
        )
    }
}

DynamicDimension.propTypes = {
    d2: PropTypes.object.isRequired,
    dialogId: PropTypes.string.isRequired,
    selectedItems: PropTypes.array.isRequired,
    onDeselect: PropTypes.func.isRequired,
    onReorder: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
}

DynamicDimension.defaultProps = {
    selectedItems: [],
    onSelect: Function.prototype,
    onDeselect: Function.prototype,
    onReorder: Function.prototype,
}

export default DynamicDimension
