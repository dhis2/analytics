import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Transfer } from '@dhis2/ui-core'
import i18n from '@dhis2/d2-i18n'

import styles from '../styles/DimensionSelector.style'
import { TransferOption } from '../TransferOption'
import GenericIcon from '../../assets/DimensionItemIcons/GenericIcon'
import {
    TRANSFER_HEIGHT,
    TRANSFER_OPTIONS_WIDTH,
    TRANSFER_SELECTED_WIDTH,
} from '../../modules/dimensionSelectorHelper'

class ItemSelector extends Component {
    state = {
        selectedItems: [],
    }

    constructor(props) {
        super(props)

        this.state.selectedItems = this.props.initialSelectedItems.map(
            item => ({
                label: item.name,
                value: item.id,
                key: item.id,
            })
        )
    }

    renderEmptySelection = () => (
        <>
            <p className="emptySelection">{i18n.t('No items selected')}</p>
            <style jsx>{styles}</style>
        </>
    )

    render = () => (
        <Transfer
            onChange={({ selected }) => {
                this.setState({ selectedItems: selected })
                this.props.onSelect(selected)
            }}
            selected={this.state.selectedItems}
            leftHeader={this.props.leftHeader}
            filterable
            enableOrderChange
            height={TRANSFER_HEIGHT}
            optionsWidth={TRANSFER_OPTIONS_WIDTH}
            selectedWidth={TRANSFER_SELECTED_WIDTH}
            selectedEmptyComponent={this.renderEmptySelection()}
            rightFooter={this.props.rightFooter}
            // TODO: Add a filter placeholer once the Transfer component supports this (https://github.com/dhis2/ui/issues/131)
            // TODO: Add rightHeader "Selected Periods" once the Transfer component supports this (https://github.com/dhis2/ui-core/issues/885)
        >
            {this.props.allItems.map(item => (
                <TransferOption
                    label={item.name}
                    value={item.id}
                    key={item.id}
                    icon={GenericIcon}
                />
            ))}
        </Transfer>
    )
}

ItemSelector.propTypes = {
    allItems: PropTypes.arrayOf(PropTypes.object).isRequired,
    onSelect: PropTypes.func.isRequired,
    initialSelectedItems: PropTypes.arrayOf(PropTypes.object),
    leftHeader: PropTypes.node,
    rightFooter: PropTypes.node,
}

ItemSelector.defaultProps = {
    initialSelectedItems: [],
}

export default ItemSelector
