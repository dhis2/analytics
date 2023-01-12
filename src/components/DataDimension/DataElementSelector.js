import { useDataEngine } from '@dhis2/app-runtime'
import {
    InputField,
    IntersectionDetector,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { apiFetchOptions } from '../../api/dimensions.js'
import i18n from '../../locales/index.js'
import {
    TOTALS,
    DETAIL,
    DIMENSION_TYPE_DATA_ELEMENT,
} from '../../modules/dataTypes.js'
// import { useDebounce, useDidUpdateEffect } from '../../modules/utils.js'
import styles from './styles/DataElementSelector.style.js'

const getOptions = () => ({
    [TOTALS]: i18n.t('Totals only'),
    [DETAIL]: i18n.t('Details only'),
})

const DisaggregationSelector = ({ currentValue, onChange }) => {
    const options = getOptions()
    return (
        <>
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
        </>
    )
}

DisaggregationSelector.propTypes = {
    currentValue: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

const DataElementSelector = ({ displayNameProp, selectedItems = [] }) => {
    const dataEngine = useDataEngine()
    const rootRef = useRef()
    const [state, setState] = useState({
        searchTerm: '',
        filter: {
            dataType: DIMENSION_TYPE_DATA_ELEMENT,
            subGroup: TOTALS,
        },
        options: [],
        loading: true,
        nextPage: 1,
        version: 'original',
    })
    // const setSearchTerm = (searchTerm) =>
    //     setState((prevState) => ({ ...prevState, searchTerm }))
    // const setFilter = (filter) =>
    //     setState((prevState) => ({ ...prevState, filter }))
    // const debouncedSearchTerm = useDebounce(state.searchTerm, 200)
    const fetchItems = async (page) => {
        setState((prevState) => ({
            ...prevState,
            loading: true,
            version: 'whenLoading',
        }))
        const result = await apiFetchOptions({
            dataEngine,
            nameProp: displayNameProp,
            page,
            filter: state.filter,
            searchTerm: state.searchTerm,
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
        setState((prevState) => ({
            ...prevState,
            loading: false,
            options:
                page > 1 ? [...prevState.options, ...newOptions] : newOptions,
            nextPage: result.nextPage,
            version: 'whenSavingOptions',
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
    }

    // useDidUpdateEffect(() => {
    //     setState((prevState) => ({
    //         ...prevState,
    //         loading: true,
    //         nextPage: 1,
    //     }))
    //     fetchItems(1)
    // }, [debouncedSearchTerm, state.filter])

    const onEndReached = ({ isIntersecting }) => {
        if (isIntersecting) {
            if (state.nextPage) {
                console.log(`NEXT PAGE: ${state.nextPage}`)
                fetchItems(state.nextPage)
            }
        }
    }

    return (
        <>
            <InputField
                value={state.searchTerm}
                // onChange={({ value }) => setSearchTerm(value)}
                placeholder={i18n.t('Search by data element name')}
                dense
                type={'search'}
            />
            <DisaggregationSelector
                currentValue={state.filter.subGroup}
                // onChange={(subGroup) => {
                //     setFilter({ ...state.filter, subGroup })
                // }}
            />
            <h2>LENGTH: {state.options.length}</h2>
            <h2>NEXT PAGE: {state.nextPage}</h2>
            <h2>VERSION: {state.version}</h2>

            <div className="scrollContainer" ref={rootRef}>
                <div className="contentContainer">
                    <p>test</p>
                    {state.options.map((option) => (
                        <p key={option.value}>{option.label}</p>
                    ))}

                    <div className="container">
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
    selectedItems: PropTypes.array,
}

export default DataElementSelector
