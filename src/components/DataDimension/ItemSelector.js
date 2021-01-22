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
import DataTypes from './DataTypesSelector'
import Groups from './Groups'
import { ALL_ID } from '../../modules/dataTypes'

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])
    return debouncedValue
}
const LeftHeader = ({ searchTerm, setSearchTerm, dataType, setDataType }) => (
    <>
        <div className="leftHeader">
            <InputField
                value={searchTerm}
                onChange={({ value }) => setSearchTerm(value)}
                placeholder={i18n.t('Search')}
                dataTest={'data-dimension-filter-input-field'}
            />
            <DataTypes
                currentDataType={dataType}
                onChange={setDataType}
                dataTest={'data-dimension-data-types-select-field'}
            />
            {/* <Groups
                dataType={this.state.dataType}
                groups={groups}
                groupId={this.state.groupId}
                onGroupChange={this.onGroupChange}
                onDetailChange={this.onDetailChange}
                detailValue={this.state.groupDetail}
                dataTest={'data-dimension-groups-select-field'}
            /> */}
        </div>
        <style jsx>{styles}</style>
    </>
)

LeftHeader.propTypes = {
    dataType: PropTypes.string,
    searchTerm: PropTypes.string,
    setDataType: PropTypes.func,
    setSearchTerm: PropTypes.func,
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
    searchTerm,
    options,
    noItemsMessage,
}) => {
    let message = ''
    if (!loading && !options.length && !searchTerm) {
        message = noItemsMessage
    } else if (!loading && !options.length && searchTerm) {
        message = i18n.t('Nothing found for {{searchTerm}}', {
            searchTerm: searchTerm,
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
    loading: PropTypes.bool,
    noItemsMessage: PropTypes.string,
    options: PropTypes.array,
    searchTerm: PropTypes.string,
}

const ItemSelector = ({
    initialSelected,
    noItemsMessage,
    onFetch,
    onSelect,
    rightFooter,
}) => {
    const [state, setState] = useState({
        searchTerm: '',
        selected: initialSelected,
        filter: {
            dataType: ALL_ID,
        },
        options: [],
        loading: true,
        nextPage: null,
    })
    const setSearchTerm = searchTerm =>
        setState(state => ({ ...state, searchTerm }))
    const setFilter = filter => setState(state => ({ ...state, filter }))
    const setSelected = selected => setState(state => ({ ...state, selected }))
    const debouncedSearchTerm = useDebounce(state.searchTerm, 200)
    const fetchItems = async page => {
        setState(state => ({ ...state, loading: true }))
        const result = await onFetch(page, state.filter, state.searchTerm) // page, filter, searchTerm
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
    }, [debouncedSearchTerm, state.filter])
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
                    searchTerm={debouncedSearchTerm}
                    options={state.options}
                    noItemsMessage={noItemsMessage}
                />
            }
            onEndReached={onEndReached}
            leftHeader={
                <LeftHeader
                    dataType={state.filter.dataType}
                    setDataType={dataType =>
                        setFilter({ ...state.filter, dataType })
                    }
                    searchTerm={state.searchTerm}
                    setSearchTerm={setSearchTerm}
                />
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
