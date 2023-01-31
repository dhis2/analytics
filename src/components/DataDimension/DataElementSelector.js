import { useDataEngine } from '@dhis2/app-runtime'
import {
    InputField,
    IntersectionDetector,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import { useDebounceCallback } from '@react-hook/debounce'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { apiFetchOptions } from '../../api/dimensions.js'
import i18n from '../../locales/index.js'
import {
    TOTALS,
    DETAIL,
    DIMENSION_TYPE_DATA_ELEMENT,
} from '../../modules/dataTypes.js'
import { getIcon, getTooltipText } from '../../modules/dimensionListItem.js'
import { TransferOption } from '../TransferOption.js'
import styles from './styles/DataElementSelector.style.js'

const getOptions = () => ({
    [TOTALS]: i18n.t('Totals only'),
    [DETAIL]: i18n.t('Details only'),
})

const GroupSelector = ({ currentValue, onChange }) => {
    // const options = getOptions()
    return (
        <div className="group-select">
            <SingleSelectField
                prefix={i18n.t('Group')}
                selected={currentValue}
                onChange={(ref) => onChange(ref.selected)}
                dense
            >
                {/* {Object.entries(options).map((option) => (
                    <SingleSelectOption
                        value={option[0]}
                        key={option[0]}
                        label={option[1]}
                    />
                ))} */}
            </SingleSelectField>
            <style jsx>{styles}</style>
        </div>
    )
}

GroupSelector.propTypes = {
    currentValue: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

const DisaggregationSelector = ({ currentValue, onChange }) => {
    const options = getOptions()
    return (
        <div className="group-select">
            <SingleSelectField
                prefix={i18n.t('Disaggregation')}
                selected={currentValue}
                onChange={(ref) => onChange(ref.selected)}
                dense
            >
                {Object.entries(options).map((option) => (
                    <SingleSelectOption
                        value={option[0]}
                        key={option[0]}
                        label={option[1]}
                    />
                ))}
            </SingleSelectField>
            <style jsx>{styles}</style>
        </div>
    )
}

DisaggregationSelector.propTypes = {
    currentValue: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

const DataElementSelector = ({
    displayNameProp,
    selectedItems = [],
    onSelect,
}) => {
    const dataEngine = useDataEngine()

    const [searchTerm, setSearchTerm] = useState('')
    const [group, setGroup] = useState()
    const [subGroup, setSubGroup] = useState(TOTALS)
    const [options, setOptions] = useState([])

    const rootRef = useRef()
    const hasNextPageRef = useRef(false)
    const searchTermRef = useRef(searchTerm)
    const pageRef = useRef(0)
    const filterRef = useRef({
        dataType: DIMENSION_TYPE_DATA_ELEMENT,
        group,
        subGroup,
    })

    const fetchData = async () => {
        try {
            const result = await apiFetchOptions({
                dataEngine,
                nameProp: displayNameProp,
                filter: filterRef.current,
                searchTerm: searchTermRef.current,
                page: pageRef.current,
            })

            // XXX also check for length?
            if (result?.dimensionItems) {
                const newOptions = result.dimensionItems.map((item) => ({
                    label: item.name,
                    value: item.id,
                    disabled: item.disabled,
                    type: item.dimensionItemType,
                    expression: item.expression,
                }))

                setOptions((prevOptions) =>
                    pageRef.current > 1
                        ? [...prevOptions, ...newOptions]
                        : newOptions
                )
            }

            hasNextPageRef.current = result?.nextPage ? true : false

            // XXX the following cannot be in here I believe, if it's still needed it should be triggered somewhere else, perhaps in a useEffect that listens to options
            // but it's not possible to call fetchData() within the effect

            /*  The following handles a very specific edge-case where the user can select all items from a
            page and then reopen the modal. Usually Transfer triggers the onEndReached when the end of
            the page is reached (scrolling down) or if too few items are on the left side (e.g. selecting
            49 items from page 1, leaving only 1 item on the left side). However, due to the way Transfer
            works, if 0 items are available, more items are fetched, but all items are already selected
            (leaving 0 items on the left side still), the onReachedEnd won't trigger. Hence the code below:
            IF there is a next page AND some options were just fetched AND you have the same or more
            selected items than fetched items AND all fetched items are already selected -> fetch more!
            */
            // if (
            //     result.nextPage &&
            //     newOptions.length &&
            //     selectedItems.length >= newOptions.length &&
            //     newOptions.every((newOption) =>
            //         selectedItems.find(
            //             (selectedItem) => selectedItem.value === newOption.value
            //         )
            //     )
            // ) {
            //     fetchItems(result.nextPage)
            // }
        } catch (error) {
            // TODO handle errors
            // setError(error)
            // XXX remove this log, just to silence the linter and allow building
            console.log('selectedItems', selectedItems)
        } finally {
            // setLoading(false)
        }
    }

    const debouncedFetchData = useDebounceCallback(() => {
        pageRef.current = 1

        rootRef.current.scrollTo({
            top: 0,
        })

        fetchData()
    }, 200)

    const onSearchChange = ({ value }) => {
        const newSearchTerm = value

        setSearchTerm(newSearchTerm)

        searchTermRef.current = newSearchTerm

        // debounce the fetch
        debouncedFetchData()
    }

    const onFilterChange = (newFilter) => {
        if (newFilter.group) {
            setGroup(newFilter.group)

            filterRef.current.group = newFilter.group
        }

        if (newFilter.subGroup) {
            setSubGroup(newFilter.subGroup)
            filterRef.current.subGroup = newFilter.subGroup
        }

        pageRef.current = 1

        rootRef.current.scrollTo({
            top: 0,
        })

        fetchData()
    }

    const onEndReached = ({ isIntersecting }) => {
        console.log(
            'onEndReached: ',
            `intersecting (${isIntersecting})`,
            `current page (${pageRef.current})`,
            `has next page (${hasNextPageRef.current})`
        )
        if (isIntersecting) {
            // if hasNextPage is set it means at least 1 request already happened and there is
            // another page, fetch the next page
            if (hasNextPageRef.current) {
                pageRef.current += 1

                fetchData()
            } else if (pageRef.current === 0) {
                // this is for fetching the initial page
                pageRef.current = 1

                fetchData()
            }
        }
    }

    return (
        <>
            <div className="filter-wrapper">
                <h4 className="sub-header">{i18n.t('Data elements')}</h4>
                <InputField
                    value={searchTerm}
                    onChange={onSearchChange}
                    placeholder={i18n.t('Search by data element name')}
                    dense
                    type={'search'}
                />
                <GroupSelector
                    currentValue={group}
                    onChange={(group) => onFilterChange({ group })}
                />

                <DisaggregationSelector
                    currentValue={subGroup}
                    onChange={(subGroup) => onFilterChange({ subGroup })}
                />
            </div>
            <div className="dimension-list-wrapper" ref={rootRef}>
                <div className="dimension-list">
                    {options.map(({ label, value, type, disabled }) => (
                        <TransferOption
                            label={label}
                            key={value}
                            value={value}
                            icon={getIcon(type)}
                            tooltipText={getTooltipText({
                                type,
                            })}
                            disabled={disabled}
                            onClick={Function.prototype}
                            onDoubleClick={onSelect}
                        />
                    ))}

                    <div className="scroll-detector">
                        <IntersectionDetector
                            onChange={onEndReached}
                            rootRef={rootRef}
                        />
                    </div>
                </div>
            </div>
            <style jsx>{styles}</style>
        </>
    )
}

DataElementSelector.propTypes = {
    displayNameProp: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    selectedItems: PropTypes.array,
}

export default DataElementSelector
