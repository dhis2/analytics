import { useDataEngine } from '@dhis2/app-runtime'
import {
    InputField,
    IntersectionDetector,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import { useSortable } from '@dnd-kit/sortable'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { apiFetchOptions } from '../../api/dimensions.js'
import i18n from '../../locales/index.js'
import {
    TOTALS,
    DETAIL,
    DIMENSION_TYPE_DATA_ELEMENT,
} from '../../modules/dataTypes.js'
import { useDebounce } from '../../modules/utils.js'
import DraggableTransferOption from './DraggableTransferOption.js'
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
    const rootRef = useRef()
    const didMountRef = useRef(false)
    const [searchInput, setSearchInput] = useState()
    const [filter, setFilter] = useState({
        dataType: DIMENSION_TYPE_DATA_ELEMENT,
        subGroup: TOTALS,
    })
    const [options, setOptions] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [hasNextPage, setHasNextPage] = useState(true)
    const debouncedSearchTerm = useDebounce(searchInput, 200)

    const { setNodeRef } = useSortable({
        id: 'dataitems',
    })

    if (selectedItems.length) {
        // FIXME: temporarily removes lint errors
        console.log(loading + setFilter())
    }

    const fetchItems = useCallback(
        async (searchTerm) => {
            setLoading(true)
            const result = await apiFetchOptions({
                dataEngine,
                nameProp: displayNameProp,
                page,
                filter,
                searchTerm,
            })
            const newOptions = []
            result.dimensionItems?.forEach((item) => {
                newOptions.push({
                    label: item.name,
                    value: item.id,
                    disabled: item.disabled,
                    type: item.dimensionItemType,
                    expression: item.expression,
                })
            })
            setLoading(false)
            setOptions((prevOptions) =>
                page > 1 ? [...prevOptions, ...newOptions] : newOptions
            )

            setHasNextPage(result.nextPage)
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
        },
        [page, dataEngine, displayNameProp, filter]
    )

    useEffect(() => {
        console.log('page useEffect')
        if (page !== 0) {
            fetchItems(debouncedSearchTerm)
        }
    }, [page, fetchItems, debouncedSearchTerm])

    useEffect(() => {
        console.log('searchTerm useEffect')
        if (didMountRef.current) {
            setPage(1)
            rootRef.current.scrollTo({
                top: 0,
            })
        }
        didMountRef.current = true
    }, [debouncedSearchTerm])

    // useDidUpdateEffect(() => {
    //     setState((prevState) => ({
    //         ...prevState,
    //         loading: true,
    //         nextPage: 1,
    //     }))
    //     fetchItems(1)
    // }, [debouncedSearchTerm, state.filter])

    const onEndReached = ({ isIntersecting }) => {
        console.log(`onEndReached, ${isIntersecting}, ${hasNextPage}`)
        if (isIntersecting && hasNextPage) {
            setPage((prevPage) => prevPage + 1)
        }
    }

    return (
        <>
            <div className="filter-wrapper">
                <h4 className="sub-header">{i18n.t('Data elements')}</h4>
                <InputField
                    value={searchInput}
                    onChange={({ value }) => setSearchInput(value)}
                    placeholder={i18n.t('Search by data element name')}
                    dense
                    type={'search'}
                />
                <GroupSelector
                    currentValue={filter.group || ''}
                    onChange={Function.prototype}
                    // onChange={(group) => {
                    //     setFilter({ ...filter, group })
                    // }}
                />
                <DisaggregationSelector
                    currentValue={filter.subGroup || ''}
                    onChange={Function.prototype}
                    // onChange={(subGroup) => {
                    //     setFilter({ ...filter, subGroup })
                    // }}
                />
            </div>
            <div className="dimension-list-wrapper" ref={rootRef}>
                <div className="dimension-list">
                    <div className="draggable-items" ref={setNodeRef}>
                        {options.map(({ label, value, type, disabled }) => (
                            <DraggableTransferOption
                                label={label}
                                key={value}
                                value={value}
                                type={type}
                                disabled={disabled}
                                onSelect={onSelect}
                            />
                        ))}
                    </div>

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