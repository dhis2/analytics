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

    const debouncedFilter = useDebounce(filter, 500)

    useEffect(() => {
        setEndReached(false)
        fetchItems(1)
    }, [debouncedFilter])

    const fetchItems = async page => {
        setLoading(true)
        const fetchResult = await onFetch(pageSize, page, debouncedFilter)

        // TODO: Test only, need to remap the result as it's coming from the wrong endpoint. Remove this once the real endpoint is used
        const test = fetchResult.dataElements.dataElements.map(
            ({ id, displayName }) => ({
                name: displayName,
                id,
                disabled: false,
            })
        )

        const newOptions = test.map(({ id, name, disabled }) => ({
            label: name,
            value: id,
            disabled,
        }))

        if (
            // No current options + no server response + no filter used = no options on the server at all
            !options.length &&
            !newOptions.length &&
            !debouncedFilter
        ) {
            setHasNoItems(true)
            setEndReached(true)
        } else if (
            // No new options (server returned 0 options) + not in the beginning of the search = end has been reached
            !newOptions.length &&
            page > 1
        ) {
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

    const renderLeftHeader = () => (
        <>
            <div className="leftHeader">
                <InputField
                    value={filter}
                    onChange={({ value }) => setFilter(value)}
                    placeholder={i18n.t('Search')}
                />
            </div>
            <style jsx>{styles}</style>
        </>
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
            return <p>{moItemsMessage}</p>
        } else if (!loading && !options.length && debouncedFilter) {
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
                    fetchItems(Math.ceil(options.length / pageSize) + 1)
                }
            }}
            leftHeader={renderLeftHeader()}
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
