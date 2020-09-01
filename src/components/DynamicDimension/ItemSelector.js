import React, { useState, useEffect } from 'react'
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

const PAGE_SIZE = 50

const ItemSelector = ({
    initialSelected,
    moItemsMessage,
    onFetch,
    onSelect,
    rightFooter,
}) => {
    const [filter, setFilter] = useState('')
    const [selected, setSelected] = useState(initialSelected)
    const [options, setOptions] = useState([])
    const [loading, setLoading] = useState(true)
    const [endReached, setEndReached] = useState(false)
    const [hasNoItems, setHasNoItems] = useState(false)
    const pageSize = PAGE_SIZE

    const debouncedFilter = useDebounce(filter, 500) // custom debounce since it's used in useEffect

    useEffect(() => {
        console.log('useEffect TRIGGERED')
        setEndReached(false)
        fetchItems(1)
    }, [debouncedFilter])

    const fetchItems = async page => {
        setLoading(true)
        console.log('FETCH ITEMS ' + page + ' ' + debouncedFilter)
        const fetchResult = await onFetch(
            pageSize, // pageSize
            page, // page
            debouncedFilter // search filter
        )

        debugger

        const newOptions = fetchResult.map(({ id, name, disabled }) => ({
            label: name,
            value: id,
            disabled,
        }))

        if (
            // No current options + no response + no filter = no options on server at all
            !options.length &&
            !newOptions.length &&
            !debouncedFilter
        ) {
            console.log('HAS NO ITEMS!')
            setHasNoItems(true)
            setEndReached(true)
        } else if (
            // No new options (server returned 0 options) + not in the beginning of the search
            !newOptions.length &&
            page > 1
        ) {
            console.log('NO NEW OPTIONS')
            setEndReached(true)
        } else {
            setEndReached(newOptions.length < pageSize)
            setOptions(page > 1 ? [...options, ...newOptions] : newOptions)
        }
        setLoading(false)
    }

    const onChange = newSelected => {
        const newSelectedWithLabel = newSelected.map(value => ({
            value,
            label: [...options, ...selected].find(item => item.value === value)
                .label,
        }))
        setSelected(newSelectedWithLabel)
        onSelect(newSelectedWithLabel)
    }

    const renderHeader = () => (
        <InputField
            value={filter}
            onChange={({ value }) => setFilter(value)}
            placeholder={i18n.t('Search')}
        />
    )

    const renderEmptySelection = () => (
        <>
            <p className="emptySelection">{i18n.t('No items selected')}</p>
            <style jsx>{styles}</style>
        </>
    )

    const renderRightHeader = () => (
        <>
            <p className="rightHeader">{i18n.t('Selected Items')}</p>
            <style jsx>{styles}</style>
        </>
    )

    const renderSourceEmptyPlaceholder = () => {
        if (hasNoItems) {
            // Show message for completely empty server result (i.e. no items on server)
            return <p>{moItemsMessage}</p>
        } else if (!loading && !options.length && debouncedFilter) {
            // Show message for empty search result, but prevent message from showing is searching for x and x is selected
            // Don't display the message while loading to prevent the message from changing behind the spinner when the filter has changed
            return (
                <p>
                    {i18n.t('Nothing found for {{searchTerm}}', {
                        searchTerm: debouncedFilter,
                    })}
                </p>
            )
        }
    }

    return (
        <Transfer
            onChange={({ selected }) => onChange(selected)}
            selected={selected.map(item => item.value)}
            options={[...options, ...selected]}
            loading={loading}
            loadingPicked={loading}
            sourceEmptyPlaceholder={renderSourceEmptyPlaceholder()}
            onEndReached={() => {
                if (options.length >= pageSize && !endReached) {
                    // Prevent triggering when options are fewer than pageSize or the end has been reached
                    console.log('END REACHED')
                    fetchItems(Math.ceil(options.length / pageSize) + 1)
                }
            }}
            leftHeader={renderHeader()}
            enableOrderChange
            height={TRANSFER_HEIGHT}
            optionsWidth={TRANSFER_OPTIONS_WIDTH}
            selectedWidth={TRANSFER_SELECTED_WIDTH}
            selectedEmptyComponent={renderEmptySelection()}
            rightHeader={renderRightHeader()}
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
    moItemsMessage: PropTypes.string,
    rightFooter: PropTypes.node,
}

ItemSelector.defaultProps = {
    initialSelected: [],
}

export default ItemSelector

// Custom debounce, since regular lodash/debounce doesn't work within a useEffect hook
// Alternatively the regular debounce can be used if wrapped in a useCallback, but I couldn't get this to work properly =/
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

/*
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
            <p className="rightHeader">{i18n.t('Selected Items')}</p>
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
            options={allItems.map(({ id, name, disabled }) => ({
                label: name,
                value: id,
                disabled,
            }))}
            renderOption={props => (
                <TransferOption {...props} icon={GenericIcon} />
            )}
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
*/
