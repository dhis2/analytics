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
    noItemsMessage,
    onFetch,
    onSelect,
    rightFooter,
}) => {
    const [filter, setFilter] = useState('')
    const [selected, setSelected] = useState(initialSelected)
    const [options, setOptions] = useState([])
    const [loading, setLoading] = useState(true)
    const [hasNoItems, setHasNoItems] = useState(false)
    const [nextPage, setNextPage] = useState(null)

    const debouncedFilter = useDebounce(filter, 500)

    useEffect(() => {
        fetchItems(1)
    }, [debouncedFilter])

    const fetchItems = async page => {
        setLoading(true)
        const result = await onFetch(page, debouncedFilter)

        const newOptions = result.dimensionItems.map(
            ({ id, name, disabled }) => ({
                label: name,
                value: id,
                disabled,
            })
        )

        // The following line is causing a rerender, which in turn causes options to be reverted back to []
        // comment it out to make the infinite scrolling work again
        setNextPage(result.nextPage)

        if (
            // No current options + no server response + no filter used = no options on the server at all
            !options.length &&
            !newOptions.length &&
            !debouncedFilter
        ) {
            setHasNoItems(true)
        } else if (!newOptions.length && debouncedFilter && page === 1) {
            // Filter used but no options for the first page = filter has no options
            setOptions([])
        } else if (newOptions.length) {
            //
            const allOptions =
                page > 1 ? [...options, ...newOptions] : newOptions
            setOptions(allOptions)
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
            <p className="emptyList">{i18n.t('No items selected')}</p>
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
        let message = ''
        if (hasNoItems) {
            message = noItemsMessage
        } else if (!loading && !options.length && debouncedFilter) {
            message = i18n.t('Nothing found for {{searchTerm}}', {
                searchTerm: debouncedFilter,
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

    return (
        <Transfer
            onChange={({ selected }) => onChange(selected)}
            selected={selected.map(item => item.value)}
            options={[...options, ...selected]}
            loading={loading}
            loadingPicked={loading}
            sourceEmptyPlaceholder={renderSourceEmptyPlaceholder()}
            onEndReached={() => {
                if (options.length >= 50) {
                    fetchItems(Math.ceil(options.length / 50) + 1)
                }
                // TODO: Replace the above with this once nextPage can be used again
                // if (nextPage) {
                //     fetchItems(nextPage)
                // }
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
    noItemsMessage: PropTypes.string,
    rightFooter: PropTypes.node,
}

ItemSelector.defaultProps = {
    initialSelected: [],
}

export default ItemSelector
