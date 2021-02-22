import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Transfer, InputField } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'

import styles from '../styles/DimensionSelector.style'
import { TransferOption } from '../TransferOption'
import GenericIcon from '../../assets/DimensionItemIcons/GenericIcon'
import {
    TRANSFER_HEIGHT,
    TRANSFER_OPTIONS_WIDTH,
    TRANSFER_SELECTED_WIDTH,
} from '../../modules/dimensionSelectorHelper'
import { useDebounce } from '../../modules/utils'

const LeftHeader = ({ filter, setFilter }) => (
    <>
        <div className="leftHeader">
            <InputField
                value={filter}
                onChange={({ value }) => setFilter(value)}
                placeholder={i18n.t('Search')}
                initialFocus
                type={'search'}
            />
        </div>
        <style jsx>{styles}</style>
    </>
)

LeftHeader.propTypes = {
    filter: PropTypes.string,
    setFilter: PropTypes.func,
}

const EmptySelection = () => (
    <>
        <p className="emptyList">{i18n.t('No items selected')}</p>
        <style jsx>{styles}</style>
    </>
)
const RightHeader = () => (
    <>
        <p className="rightHeader">{i18n.t('Selected Items')}</p>
        <style jsx>{styles}</style>
    </>
)
const SourceEmptyPlaceholder = ({
    loading,
    filter,
    options,
    noItemsMessage,
}) => {
    let message = ''
    if (!loading && !options.length && !filter) {
        message = noItemsMessage || i18n.t('No data')
    } else if (!loading && !options.length && filter) {
        message = i18n.t('Nothing found for {{searchTerm}}', {
            searchTerm: filter,
        })
    }
    return (
        message && (
            <>
                <p className="emptyList">{message}</p>
                <style jsx>{styles}</style>
            </>
        )
    )
}

SourceEmptyPlaceholder.propTypes = {
    filter: PropTypes.string,
    loading: PropTypes.bool,
    noItemsMessage: PropTypes.string,
    options: PropTypes.array,
}

const ItemSelector = ({
    initialSelected,
    noItemsMessage,
    onFetch,
    onSelect,
    rightFooter,
}) => {
    const [state, setState] = useState({
        filter: '',
        selected: initialSelected,
        // FIXME: keeping selected in state is redundant, use the initialSelected prop directly instead
        // The useCallback from onChange should be removed in favor of a regular fn as well
        options: [],
        loading: true,
        nextPage: null, // FIXME: Selecting all 50 items from a page prevents the loading of more items.
        // Implement the solution found in the DataDimension/ItemSelector.js
    })
    const setFilter = filter => setState(state => ({ ...state, filter }))
    const setSelected = selected => setState(state => ({ ...state, selected }))
    const debouncedFilter = useDebounce(state.filter, 200)
    const fetchItems = async page => {
        setState(state => ({ ...state, loading: true }))
        const result = await onFetch(page, state.filter)
        const newOptions = result.dimensionItems?.map(
            ({ id, name, disabled }) => ({
                label: name,
                value: id,
                disabled,
            })
        )
        setState(state => ({
            ...state,
            loading: false,
            options: page > 1 ? [...state.options, ...newOptions] : newOptions,
            nextPage: result.nextPage,
        }))
    }
    useEffect(() => {
        fetchItems(1)
    }, [debouncedFilter])
    const onChange = useCallback(
        newSelected => {
            const newSelectedWithLabel = newSelected.map(value => ({
                value,
                label: [...state.options, ...state.selected].find(
                    item => item.value === value
                ).label,
            }))
            setSelected(newSelectedWithLabel)
            onSelect(newSelectedWithLabel)
        },
        [state.options, state.selected]
    )
    const onEndReached = useCallback(() => {
        if (state.nextPage) {
            fetchItems(state.nextPage)
        }
    }, [state.nextPage])
    return (
        <Transfer
            onChange={({ selected }) => onChange(selected)}
            selected={state.selected.map(item => item.value)}
            options={[...state.options, ...state.selected]}
            loading={state.loading}
            loadingPicked={state.loading}
            sourceEmptyPlaceholder={
                <SourceEmptyPlaceholder
                    loading={state.loading}
                    filter={debouncedFilter}
                    options={state.options}
                    noItemsMessage={noItemsMessage}
                />
            }
            onEndReached={onEndReached}
            leftHeader={
                <LeftHeader filter={state.filter} setFilter={setFilter} />
            }
            enableOrderChange
            height={TRANSFER_HEIGHT}
            optionsWidth={TRANSFER_OPTIONS_WIDTH}
            selectedWidth={TRANSFER_SELECTED_WIDTH}
            selectedEmptyComponent={<EmptySelection />}
            rightHeader={<RightHeader />}
            rightFooter={rightFooter}
            renderOption={props => (
                <TransferOption {...props} icon={GenericIcon} />
            )}
        />
    )
}

ItemSelector.propTypes = {
    onFetch: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    initialSelected: PropTypes.arrayOf(
        PropTypes.exact({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        })
    ),
    noItemsMessage: PropTypes.string,
    rightFooter: PropTypes.node,
}

ItemSelector.defaultProps = {
    initialSelected: [],
}

export default ItemSelector
