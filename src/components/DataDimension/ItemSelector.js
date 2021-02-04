import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Transfer, InputField, IconInfo16 } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { useDataEngine } from '@dhis2/app-runtime'

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
import {
    ALL_ID,
    dataTypes,
    DATA_ELEMENTS,
    DATA_ELEMENT_OPERAND,
    DATA_SETS,
    EVENT_DATA_ITEMS,
    PROGRAM_INDICATORS,
    INDICATORS,
    TOTALS,
} from '../../modules/dataTypes'
import { apiFetchOptions } from '../../api/dimensions'
import { DATA_SETS_CONSTANTS, REPORTING_RATE } from '../../modules/dataSets'

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
const LeftHeader = ({
    searchTerm,
    setSearchTerm,
    dataType,
    setDataType,
    group,
    setGroup,
    subGroup,
    setSubGroup,
    displayNameProp,
}) => (
    <>
        <div className="leftHeader">
            <InputField
                value={searchTerm}
                onChange={({ value }) => setSearchTerm(value)}
                placeholder={i18n.t('Search by data item name or id')}
                dataTest={'data-dimension-filter-input-field'}
                dense
                initialFocus
            />
            <DataTypes
                currentDataType={dataType}
                onChange={setDataType}
                dataTest={'data-dimension-data-types-select-field'}
            />
            {dataTypes[dataType] && (
                <Groups
                    dataType={dataType}
                    displayNameProp={displayNameProp}
                    currentGroup={group}
                    onGroupChange={setGroup}
                    currentSubGroup={subGroup}
                    onSubGroupChange={setSubGroup}
                    dataTest={'data-dimension-groups-select-field'}
                />
            )}
        </div>
        <style jsx>{styles}</style>
    </>
)

LeftHeader.propTypes = {
    dataType: PropTypes.string,
    displayNameProp: PropTypes.string,
    group: PropTypes.string,
    searchTerm: PropTypes.string,
    setDataType: PropTypes.func,
    setGroup: PropTypes.func,
    setSearchTerm: PropTypes.func,
    setSubGroup: PropTypes.func,
    subGroup: PropTypes.string,
}

const EmptySelection = () => (
    <>
        <p className="emptyList">{i18n.t('No items selected')}</p>
        <style jsx>{styles}</style>
    </>
)
const RightHeader = ({ infoText }) => (
    <>
        <p className="rightHeader">{i18n.t('Selected Items')}</p>
        {infoText && (
            <div className="info-container">
                <div>
                    <IconInfo16 />
                </div>
                <span className="info-text">{infoText}</span>
            </div>
        )}
        <style jsx>{styles}</style>
    </>
)
RightHeader.propTypes = {
    infoText: PropTypes.string,
}
const SourceEmptyPlaceholder = ({
    loading,
    searchTerm,
    options,
    noItemsMessage,
    dataType,
}) => {
    let message = ''
    if (!loading && !options.length && !searchTerm) {
        message = noItemsMessage || i18n.t('No data')
    } else if (!loading && !options.length && searchTerm) {
        switch (dataType) {
            case INDICATORS:
                message = i18n.t('No indicators found for {{searchTerm}}', {
                    searchTerm: searchTerm,
                })
                break
            case DATA_ELEMENTS:
                message = i18n.t('No data elements found for {{searchTerm}}', {
                    searchTerm: searchTerm,
                })
                break
            case DATA_SETS:
                message = i18n.t('No data sets found for {{searchTerm}}', {
                    searchTerm: searchTerm,
                })
                break
            case EVENT_DATA_ITEMS:
                message = i18n.t(
                    'No event data items found for {{searchTerm}}',
                    {
                        searchTerm: searchTerm,
                    }
                )
                break
            case PROGRAM_INDICATORS:
                message = i18n.t(
                    'No program indicators found for {{searchTerm}}',
                    {
                        searchTerm: searchTerm,
                    }
                )
                break
            default:
                message = i18n.t('Nothing found for {{searchTerm}}', {
                    searchTerm: searchTerm,
                })
                break
        }
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
    dataType: PropTypes.string,
    loading: PropTypes.bool,
    noItemsMessage: PropTypes.string,
    options: PropTypes.array,
    searchTerm: PropTypes.string,
}

const ItemSelector = ({
    selectedItems,
    noItemsMessage,
    onSelect,
    rightFooter,
    displayNameProp,
    infoBoxMessage,
    dataTest,
}) => {
    const [state, setState] = useState({
        searchTerm: '',
        filter: {
            dataType: ALL_ID,
        },
        options: [],
        loading: true,
        nextPage: 1,
    })
    const dataEngine = useDataEngine()
    const setSearchTerm = searchTerm =>
        setState(state => ({ ...state, searchTerm }))
    const setFilter = filter => setState(state => ({ ...state, filter }))
    const debouncedSearchTerm = useDebounce(state.searchTerm, 200)
    const fetchItems = async page => {
        setState(state => ({ ...state, loading: true }))
        const result = await apiFetchOptions({
            dataEngine,
            nameProp: displayNameProp,
            page,
            filter: state.filter,
            searchTerm: state.searchTerm,
        })
        const newOptions = []
        result.dimensionItems?.forEach(item => {
            if (item.dimensionItemType === REPORTING_RATE) {
                if (state.filter.subGroup && state.filter.subGroup !== ALL_ID) {
                    const metric = DATA_SETS_CONSTANTS.find(
                        item => item.id === state.filter.subGroup
                    )
                    newOptions.push({
                        label: `${item.name} – ${metric.getName()}`,
                        value: `${item.id}.${metric.id}`,
                        disabled: item.disabled,
                        type: item.dimensionItemType,
                    })
                } else {
                    DATA_SETS_CONSTANTS.forEach(metric => {
                        newOptions.push({
                            label: `${item.name} – ${metric.getName()}`,
                            value: `${item.id}.${metric.id}`,
                            disabled: item.disabled,
                            type: item.dimensionItemType,
                        })
                    })
                }
            } else {
                newOptions.push({
                    label: item.name,
                    value: item.id,
                    disabled: item.disabled,
                    type: item.dimensionItemType,
                })
            }
        })
        setState(state => ({
            ...state,
            loading: false,
            options: page > 1 ? [...state.options, ...newOptions] : newOptions,
            nextPage: result.nextPage,
        }))
        if (
            newOptions.length &&
            selectedItems.length >= newOptions.length &&
            newOptions.every(newOption =>
                selectedItems.find(
                    selectedItem => selectedItem.value === newOption.value
                )
            )
        ) {
            fetchItems(result.nextPage)
        }
    }
    const useDidUpdateEffect = (fn, inputs) => {
        // TODO: Move this to a utils file
        const didMountRef = useRef(false)

        useEffect(() => {
            if (didMountRef.current) fn()
            else didMountRef.current = true
        }, inputs)
    }
    useDidUpdateEffect(() => {
        setState(state => ({
            ...state,
            loading: true,
            options: [],
            nextPage: 1,
        }))
    }, [debouncedSearchTerm, state.filter])
    const onChange = newSelected => {
        onSelect(
            newSelected.map(value => {
                const matchingItem = [...state.options, ...selectedItems].find(
                    item => item.value === value
                )
                return {
                    value,
                    label: matchingItem.label,
                    type: matchingItem.type,
                }
            })
        )
    }
    const onEndReached = () => {
        if (state.nextPage) {
            fetchItems(state.nextPage)
        }
    }
    const isActive = value => {
        const item = selectedItems.find(item => item.value === value)
        return !item || item.isActive
    }
    const getItemType = value =>
        state.options.find(item => item.value === value)?.type
    const getTooltipText = itemType => {
        switch (itemType) {
            case DATA_ELEMENT_OPERAND:
                return dataTypes[DATA_ELEMENTS].getItemName()
            case REPORTING_RATE:
                return dataTypes[DATA_SETS].getItemName()
            default:
                return dataTypes[itemType]?.getItemName()
        }
    }
    return (
        <Transfer
            onChange={({ selected }) => onChange(selected)}
            selected={selectedItems.map(item => item.value)}
            options={[...state.options, ...selectedItems]}
            loading={state.loading}
            loadingPicked={state.loading}
            sourceEmptyPlaceholder={
                <SourceEmptyPlaceholder
                    loading={state.loading}
                    searchTerm={debouncedSearchTerm}
                    options={state.options}
                    noItemsMessage={noItemsMessage}
                    dataType={state.filter.dataType}
                />
            }
            onEndReached={onEndReached}
            leftHeader={
                <LeftHeader
                    dataType={state.filter.dataType}
                    setDataType={dataType => {
                        setFilter({
                            ...state.filter,
                            dataType,
                            group: null,
                            subGroup:
                                dataType === DATA_ELEMENTS ? TOTALS : null,
                        })
                    }}
                    group={state.filter.group}
                    setGroup={group => {
                        setFilter({ ...state.filter, group })
                    }}
                    subGroup={state.filter.subGroup}
                    setSubGroup={subGroup => {
                        setFilter({ ...state.filter, subGroup })
                    }}
                    searchTerm={state.searchTerm}
                    setSearchTerm={setSearchTerm}
                    displayNameProp={displayNameProp}
                />
            }
            enableOrderChange
            height={TRANSFER_HEIGHT}
            optionsWidth={TRANSFER_OPTIONS_WIDTH}
            selectedWidth={TRANSFER_SELECTED_WIDTH}
            selectedEmptyComponent={<EmptySelection />}
            rightHeader={<RightHeader infoText={infoBoxMessage} />}
            rightFooter={rightFooter}
            renderOption={props => (
                <TransferOption
                    {...props}
                    active={isActive(
                        props.value /* eslint-disable-line react/prop-types */
                    )}
                    icon={GenericIcon}
                    tooltipText={getTooltipText(
                        getItemType(
                            props.value /* eslint-disable-line react/prop-types */
                        )
                    )}
                />
            )}
            dataTest={`${dataTest}-transfer`}
        />
    )
}

ItemSelector.propTypes = {
    displayNameProp: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
    infoBoxMessage: PropTypes.string,
    noItemsMessage: PropTypes.string,
    rightFooter: PropTypes.node,
    selectedItems: PropTypes.arrayOf(
        PropTypes.exact({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
            isActive: PropTypes.bool,
        })
    ),
}

ItemSelector.defaultProps = {
    selectedItems: [],
}

export default ItemSelector
