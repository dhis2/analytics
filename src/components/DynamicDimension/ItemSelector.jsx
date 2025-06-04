import { Transfer } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import GenericIcon from '../../assets/DimensionItemIcons/GenericIcon.jsx'
import i18n from '../../locales/index.js'
import {
    TRANSFER_HEIGHT,
    TRANSFER_OPTIONS_WIDTH,
    TRANSFER_SELECTED_WIDTH,
} from '../../modules/dimensionSelectorHelper.js'
import { useDebounce, useDidUpdateEffect } from '../../modules/utils.js'
import { SelectedEmptyPlaceholder } from '../DataDimension/SelectedEmptyPlaceholder.jsx'
import { SourceEmptyPlaceholder } from '../DataDimension/SourceEmptyPlaceholder.jsx'
import styles from '../styles/DimensionSelector.style.js'
import { TransferOption } from '../TransferOption.jsx'

const ItemSelector = ({
    selectedItems,
    noItemsMessage,
    onFetch,
    onSelect,
    rightFooter,
    dataTest,
}) => {
    const [state, setState] = useState({
        searchTerm: '',
        options: [],
        loading: true,
        nextPage: 1,
    })
    const debouncedSearchTerm = useDebounce(state.searchTerm, 500)

    const setSearchTerm = (searchTerm) =>
        setState((state) => ({ ...state, searchTerm }))

    const fetchItems = async (page) => {
        setState((state) => ({
            ...state,
            nextPage: page === 1 ? 1 : state.nextPage,
            loading: true,
        }))

        const result = await onFetch(page, state.searchTerm)
        const newOptions = result.dimensionItems?.map(
            ({ id, name, disabled }) => ({
                label: name,
                value: id,
                disabled,
            })
        )
        setState((state) => ({
            ...state,
            loading: false,
            options: page > 1 ? [...state.options, ...newOptions] : newOptions,
            nextPage: result.nextPage,
        }))
        /*  The following handles a very specific edge-case where the user can select all items from a
            page and then reopen the modal. Usually Transfer triggers the onEndReached when the end of
            the page is reached (scrolling down) or if too few items are on the left side (e.g. selecting
            49 items from page 1, leaving only 1 item on the left side). However, due to the way Transfer
            works, if 0 items are available, more items are fetched, but all items are already selected
            (leaving 0 items on the left side still), the onReachedEnd won't trigger. Hence the code below:
            IF there is a next page AND some options were just fetched AND you have the same or more
            selected items than fetched items AND all fetched items are already selected -> fetch more!
        */
        if (
            result.nextPage &&
            newOptions.length &&
            selectedItems.length >= newOptions.length &&
            newOptions.every((newOption) =>
                selectedItems.find(
                    (selectedItem) => selectedItem.value === newOption.value
                )
            )
        ) {
            fetchItems(result.nextPage)
        }
    }

    useDidUpdateEffect(() => {
        fetchItems(1)
    }, [debouncedSearchTerm])

    const onChange = (selectedIds) => {
        const newSelectedWithLabel = selectedIds.map((id) => ({
            value: id,
            label: [...state.options, ...selectedItems].find(
                (item) => item.value === id
            ).label,
        }))

        onSelect(newSelectedWithLabel)
    }

    const onEndReached = () => {
        if (state.nextPage) {
            fetchItems(state.nextPage)
        }
    }

    return (
        <>
            <Transfer
                onChange={({ selected }) => onChange(selected)}
                selected={selectedItems.map((item) => item.value)}
                options={[...state.options, ...selectedItems]}
                loading={state.loading}
                loadingPicked={state.loading}
                sourceEmptyPlaceholder={
                    <SourceEmptyPlaceholder
                        loading={state.loading}
                        searchTerm={debouncedSearchTerm}
                        options={state.options}
                        noItemsMessage={noItemsMessage}
                    />
                }
                onEndReached={onEndReached}
                filterable
                filterPlaceholder={i18n.t('Search')}
                filterablePicked={false}
                searchTerm={state.searchTerm}
                onFilterChange={({ value }) => setSearchTerm(value)}
                enableOrderChange
                height={TRANSFER_HEIGHT}
                optionsWidth={TRANSFER_OPTIONS_WIDTH}
                selectedWidth={TRANSFER_SELECTED_WIDTH}
                selectedEmptyComponent={<SelectedEmptyPlaceholder />}
                rightHeader={
                    <p className="rightHeader">{i18n.t('Selected Items')}</p>
                }
                rightFooter={rightFooter}
                renderOption={(props) => (
                    <TransferOption
                        {...props}
                        icon={GenericIcon}
                        dataTest={`${dataTest}-transfer-option`}
                    />
                )}
                dataTest={`${dataTest}-transfer`}
            />
            <style jsx>{styles}</style>
        </>
    )
}

ItemSelector.propTypes = {
    onFetch: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
    noItemsMessage: PropTypes.string,
    rightFooter: PropTypes.node,
    selectedItems: PropTypes.arrayOf(
        PropTypes.exact({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        })
    ),
}

ItemSelector.defaultProps = {
    selectedItems: [],
}

export default ItemSelector
