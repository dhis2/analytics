import { useDataEngine } from '@dhis2/app-runtime'
import {
    Center,
    CircularLoader,
    Cover,
    InputField,
    IntersectionDetector,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import { useDebounceCallback } from '@react-hook/debounce'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { apiFetchOptions, apiFetchGroups } from '../../api/dimensions.js'
import i18n from '../../locales/index.js'
import {
    TOTALS,
    DETAIL,
    DIMENSION_TYPE_ALL,
    DIMENSION_TYPE_DATA_ELEMENT,
    dataTypeMap as dataTypes,
} from '../../modules/dataTypes.js'
import { getIcon, getTooltipText } from '../../modules/dimensionListItem.js'
import { TransferOption } from '../TransferOption.js'
import styles from './styles/DataElementSelector.style.js'

const getOptions = () => ({
    [TOTALS]: i18n.t('Totals only'),
    [DETAIL]: i18n.t('Details only'),
})

const GroupSelector = ({ currentValue, onChange, displayNameProp }) => {
    const dataEngine = useDataEngine()

    const [loading, setLoading] = useState(true)
    const [groups, setGroups] = useState([])

    const defaultGroup = dataTypes[DIMENSION_TYPE_DATA_ELEMENT]?.defaultGroup

    useEffect(() => {
        const fetchGroups = async () => {
            setLoading(true)

            const result = await apiFetchGroups(
                dataEngine,
                DIMENSION_TYPE_DATA_ELEMENT,
                displayNameProp
            )

            setGroups(result)

            setLoading(false)
        }

        fetchGroups()
    }, [dataEngine, displayNameProp])

    return (
        <div className="group-select">
            <SingleSelectField
                prefix={i18n.t('Group')}
                selected={currentValue}
                onChange={(ref) => onChange(ref.selected)}
                dense
                loading={loading}
                loadingText={i18n.t('Loading')}
            >
                {defaultGroup ? (
                    <SingleSelectOption
                        value={defaultGroup.id}
                        key={defaultGroup.id}
                        label={defaultGroup.getName()}
                    />
                ) : null}
                {!loading
                    ? groups.map((group) => (
                          <SingleSelectOption
                              value={group.id}
                              key={group.id}
                              label={group.name}
                          />
                      ))
                    : null}
            </SingleSelectField>
            <style jsx>{styles}</style>
        </div>
    )
}

GroupSelector.propTypes = {
    currentValue: PropTypes.string.isRequired,
    displayNameProp: PropTypes.string.isRequired,
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

const DataElementSelector = ({ displayNameProp, onSelect }) => {
    const dataEngine = useDataEngine()

    const [searchTerm, setSearchTerm] = useState('')
    const [group, setGroup] = useState(DIMENSION_TYPE_ALL)
    const [subGroup, setSubGroup] = useState(TOTALS)
    const [options, setOptions] = useState([])
    const [loading, setLoading] = useState(true)

    const rootRef = useRef()
    const hasNextPageRef = useRef(false)
    const searchTermRef = useRef(searchTerm)
    const pageRef = useRef(0)
    const filterRef = useRef({
        dataType: DIMENSION_TYPE_DATA_ELEMENT,
        group,
        subGroup,
    })

    const fetchData = async (scrollToTop) => {
        try {
            setLoading(true)

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
        } catch (error) {
            // TODO handle errors
            // setError(error)
        } finally {
            setLoading(false)

            if (scrollToTop) {
                rootRef.current.scrollTo({
                    top: 0,
                })
            }
        }
    }

    const debouncedFetchData = useDebounceCallback(() => {
        pageRef.current = 1

        fetchData(true)
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

        fetchData(true)
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
                    displayNameProp={displayNameProp}
                />

                <DisaggregationSelector
                    currentValue={subGroup}
                    onChange={(subGroup) => onFilterChange({ subGroup })}
                />
            </div>
            <div className="dimension-list-container">
                <div className="dimension-list-scrollbox" ref={rootRef}>
                    <div className="dimension-list-scroller">
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
                {loading && (
                    <div className="dimension-list-overlay">
                        <Cover>
                            <Center>
                                <CircularLoader />
                            </Center>
                        </Cover>
                    </div>
                )}
            </div>
            <style jsx>{styles}</style>
        </>
    )
}

DataElementSelector.propTypes = {
    displayNameProp: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
}

export default DataElementSelector
