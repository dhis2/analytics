import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Transfer } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'

import styles from '../styles/DimensionSelector.style'
import { TransferOption } from '../TransferOption'
import GenericIcon from '../../assets/DimensionItemIcons/GenericIcon'
import {
    TRANSFER_HEIGHT,
    TRANSFER_OPTIONS_WIDTH,
    TRANSFER_SELECTED_WIDTH,
} from '../../modules/dimensionSelectorHelper'

const ItemSelector = ({
    allItems,
    onSelect,
    initialSelectedItemIds,
    leftHeader,
    rightFooter,
}) => {
    const [selectedItemIds, setSelectedItemIds] = useState(
        initialSelectedItemIds
    )

    const renderEmptySelection = () => (
        <>
            <p className="emptySelection">{i18n.t('No items selected')}</p>
            <style jsx>{styles}</style>
        </>
    )

    const renderRightHeader = () => (
        <>
            <p className="rightHeader">{i18n.t('Selected Data')}</p>
            <style jsx>{styles}</style>
        </>
    )

    return (
        <Transfer
            onChange={({ selected }) => {
                setSelectedItemIds(selected)
                onSelect(selected)
            }}
            selected={selectedItemIds}
            leftHeader={leftHeader}
            filterable
            filterPlaceholder={i18n.t('Search')}
            enableOrderChange
            height={TRANSFER_HEIGHT}
            optionsWidth={TRANSFER_OPTIONS_WIDTH}
            selectedWidth={TRANSFER_SELECTED_WIDTH}
            selectedEmptyComponent={renderEmptySelection()}
            rightHeader={renderRightHeader()}
            rightFooter={rightFooter}
            options={allItems.map(({ id, name }) => ({
                label: name,
                value: id,
            }))}
            renderOption={props => (
                <TransferOption {...props} icon={GenericIcon} />
            )}
            // TODO: Add a filter placeholer once the Transfer component supports this (https://github.com/dhis2/ui/issues/131)
            // TODO: Add rightHeader "Selected Periods" once the Transfer component supports this (https://github.com/dhis2/ui-core/issues/885)
        />
    )
}

ItemSelector.propTypes = {
    allItems: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
        })
    ).isRequired,
    onSelect: PropTypes.func.isRequired,
    initialSelectedItemIds: PropTypes.arrayOf(PropTypes.string),
    leftHeader: PropTypes.node,
    rightFooter: PropTypes.node,
}

ItemSelector.defaultProps = {
    initialSelectedItemIds: [],
}

export default ItemSelector
