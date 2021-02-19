import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
    Transfer,
    InputField,
    IconInfo16,
    IconDimensionDataSet16,
    IconDimensionIndicator16,
    IconDimensionEventDataItem16,
    IconDimensionProgramIndicator16,
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { useDataEngine } from '@dhis2/app-runtime'

import styles from '../styles/DimensionSelector.style'
import { TransferOption } from '../TransferOption'
import {
    TRANSFER_HEIGHT,
    TRANSFER_OPTIONS_WIDTH,
    TRANSFER_SELECTED_WIDTH,
} from '../../modules/dimensionSelectorHelper'
import DataTypeSelector from './DataTypesSelector'
import GroupSelector from './GroupSelector'
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
    PROGRAM_DATA_ELEMENT,
    PROGRAM_ATTRIBUTE,
} from '../../modules/dataTypes'
import { apiFetchOptions } from '../../api/dimensions'
import { DATA_SETS_CONSTANTS, REPORTING_RATE } from '../../modules/dataSets'
import DataElementIcon from '../../assets/DimensionItemIcons/DataElementIcon'
import GenericIcon from '../../assets/DimensionItemIcons/GenericIcon'
import { useDebounce, useDidUpdateEffect } from '../../modules/utils'

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
    dataTest,
}) => (
    <>
        <div className="leftHeader">
            <InputField
                value={searchTerm}
                onChange={({ value }) => setSearchTerm(value)}
                placeholder={i18n.t('Search by data item name or id')}
                dataTest={`${dataTest}-filter-input-field`}
                dense
                initialFocus
                type={'search'}
            />
            <DataTypeSelector
                currentDataType={dataType}
                onChange={setDataType}
                dataTest={`${dataTest}-data-types-select-field`}
            />
            {dataTypes[dataType] && (
                <GroupSelector
                    dataType={dataType}
                    displayNameProp={displayNameProp}
                    currentGroup={group}
                    onGroupChange={setGroup}
                    currentSubGroup={subGroup}
                    onSubGroupChange={setSubGroup}
                    dataTest={dataTest}
                />
            )}
        </div>
        <style jsx>{styles}</style>
    </>
)

LeftHeader.propTypes = {
    dataTest: PropTypes.string,
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
    dataTest,
}) => {
    let message = ''
    if (!loading && !options.length && !searchTerm) {
        if (noItemsMessage) {
            message = noItemsMessage
        } else {
            switch (dataType) {
                case INDICATORS:
                    message = i18n.t('No indicators found')
                    break
                case DATA_ELEMENTS:
                    message = i18n.t('No data elements found')
                    break
                case DATA_SETS:
                    message = i18n.t('No data sets found')
                    break
                case EVENT_DATA_ITEMS:
                    message = i18n.t('No event data items found')
                    break
                case PROGRAM_INDICATORS:
                    message = i18n.t('No program indicators found')
                    break
                default:
                    message = i18n.t('No data')
                    break
            }
        }
    } else if (!loading && !options.length && searchTerm) {
        switch (dataType) {
            case INDICATORS:
                message = i18n.t('No indicators found for "{{searchTerm}}"', {
                    searchTerm: searchTerm,
                    interpolation: { escapeValue: false },
                })
                break
            case DATA_ELEMENTS:
                message = i18n.t(
                    'No data elements found for "{{searchTerm}}"',
                    {
                        searchTerm: searchTerm,
                        interpolation: { escapeValue: false },
                    }
                )
                break
            case DATA_SETS:
                message = i18n.t('No data sets found for "{{searchTerm}}"', {
                    searchTerm: searchTerm,
                    interpolation: { escapeValue: false },
                })
                break
            case EVENT_DATA_ITEMS:
                message = i18n.t(
                    'No event data items found for "{{searchTerm}}"',
                    {
                        searchTerm: searchTerm,
                        interpolation: { escapeValue: false },
                    }
                )
                break
            case PROGRAM_INDICATORS:
                message = i18n.t(
                    'No program indicators found for "{{searchTerm}}"',
                    {
                        searchTerm: searchTerm,
                        interpolation: { escapeValue: false },
                    }
                )
                break
            default:
                message = i18n.t('Nothing found for "{{searchTerm}}"', {
                    searchTerm: searchTerm,
                    interpolation: { escapeValue: false },
                })
                break
        }
    }
    return (
        message && (
            <>
                <p className="emptyList" data-test={dataTest}>
                    {message}
                </p>
                <style jsx>{styles}</style>
            </>
        )
    )
}

SourceEmptyPlaceholder.propTypes = {
    dataTest: PropTypes.string,
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
                        label: `${item.name} - ${metric.getName()}`,
                        value: `${item.id}.${metric.id}`,
                        disabled: item.disabled,
                        type: item.dimensionItemType,
                    })
                } else {
                    DATA_SETS_CONSTANTS.forEach(metric => {
                        newOptions.push({
                            label: `${item.name} - ${metric.getName()}`,
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
        /*  The following handles a very specific edge-case where the user can select all items from a 
            page and then reopen the modal. Usually Transfer triggers the onEndReached when the end of 
            the page is reached (scrolling down) or if too few items are on the left side (e.g. selecting 
            49 items from page 1, leaving only 1 item on the left side). However, due to the way Transfer 
            works, if 0 items are available, more items are fetched, but all items are already selected 
            (leaving 0 items on the left side still), the onReachedEnd won't trigger. Hence the code below:
            IF there is a next page AND some options were just fetched AND you have the same or more
            selected items than fetched items AND all fetched items are already selected -> fetch more!
        */
        if (
            result.nextPage &&
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

    useDidUpdateEffect(() => {
        setState(state => ({
            ...state,
            loading: true,
            nextPage: 1,
        }))
        fetchItems(1)
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
        [...state.options, ...selectedItems].find(item => item.value === value)
            ?.type
    const getTooltipText = itemType => {
        switch (itemType) {
            case DATA_ELEMENT_OPERAND:
                return dataTypes[DATA_ELEMENTS].getItemName()
            case REPORTING_RATE:
                return dataTypes[DATA_SETS].getItemName()
            case PROGRAM_DATA_ELEMENT:
            case PROGRAM_ATTRIBUTE:
                return dataTypes[EVENT_DATA_ITEMS].getItemName()
            default:
                return dataTypes[itemType]?.getItemName()
        }
    }
    const getIcon = itemType => {
        switch (itemType) {
            case INDICATORS:
                return <IconDimensionIndicator16 />
            case DATA_ELEMENT_OPERAND:
            case DATA_ELEMENTS:
                return DataElementIcon
            case REPORTING_RATE:
                return <IconDimensionDataSet16 />
            case EVENT_DATA_ITEMS:
            case PROGRAM_DATA_ELEMENT:
            case PROGRAM_ATTRIBUTE:
                return <IconDimensionEventDataItem16 />
            case PROGRAM_INDICATORS:
                return <IconDimensionProgramIndicator16 />
            default:
                return GenericIcon
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
                    dataTest={`${dataTest}-empty-source`}
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
                    dataTest={`${dataTest}-left-header`}
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
                    icon={getIcon(
                        getItemType(
                            props.value /* eslint-disable-line react/prop-types */
                        )
                    )}
                    tooltipText={getTooltipText(
                        getItemType(
                            props.value /* eslint-disable-line react/prop-types */
                        )
                    )}
                    dataTest={`${dataTest}-transfer-option`}
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
            type: PropTypes.string,
        })
    ),
}

ItemSelector.defaultProps = {
    selectedItems: [],
}

export default ItemSelector
