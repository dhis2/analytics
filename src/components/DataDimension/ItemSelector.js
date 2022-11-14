import { useDataEngine } from '@dhis2/app-runtime'
import {
    Transfer,
    InputField,
    IconInfo16,
    IconDimensionDataSet16,
    IconDimensionIndicator16,
    IconDimensionEventDataItem16,
    IconDimensionProgramIndicator16,
    Button,
    IconAdd24,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { apiFetchOptions } from '../../api/dimensions.js'
import DataElementIcon from '../../assets/DimensionItemIcons/DataElementIcon.js'
import GenericIcon from '../../assets/DimensionItemIcons/GenericIcon.js'
import i18n from '../../locales/index.js'
import { DATA_SETS_CONSTANTS, REPORTING_RATE } from '../../modules/dataSets.js'
import {
    dataTypeMap as dataTypes,
    DIMENSION_TYPE_ALL,
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_DATA_ELEMENT_OPERAND,
    DIMENSION_TYPE_DATA_SET,
    DIMENSION_TYPE_EVENT_DATA_ITEM,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
    DIMENSION_TYPE_INDICATOR,
    TOTALS,
    DIMENSION_TYPE_PROGRAM_DATA_ELEMENT,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    DIMENSION_TYPE_CALCULATION,
} from '../../modules/dataTypes.js'
import {
    TRANSFER_HEIGHT,
    TRANSFER_OPTIONS_WIDTH,
    TRANSFER_SELECTED_WIDTH,
} from '../../modules/dimensionSelectorHelper.js'
import { useDebounce, useDidUpdateEffect } from '../../modules/utils.js'
import styles from '../styles/DimensionSelector.style.js'
import { TransferOption } from '../TransferOption.js'
import CalculationIcon from './../../assets/DimensionItemIcons/CalculationIcon.js'
import DataTypeSelector from './DataTypeSelector.js'
import EditCalculation from './EditCalculation.js'
import GroupSelector from './GroupSelector.js'

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
                placeholder={i18n.t('Search by data item name')}
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
            {dataTypes[dataType] && dataType !== DIMENSION_TYPE_CALCULATION && (
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
                case DIMENSION_TYPE_INDICATOR:
                    message = i18n.t('No indicators found')
                    break
                case DIMENSION_TYPE_DATA_ELEMENT:
                    message = i18n.t('No data elements found')
                    break
                case DIMENSION_TYPE_DATA_SET:
                    message = i18n.t('No data sets found')
                    break
                case DIMENSION_TYPE_EVENT_DATA_ITEM:
                    message = i18n.t('No event data items found')
                    break
                case DIMENSION_TYPE_PROGRAM_INDICATOR:
                    message = i18n.t('No program indicators found')
                    break
                default:
                    message = i18n.t('No data')
                    break
            }
        }
    } else if (!loading && !options.length && searchTerm) {
        switch (dataType) {
            case DIMENSION_TYPE_INDICATOR:
                message = i18n.t('No indicators found for "{{- searchTerm}}"', {
                    searchTerm: searchTerm,
                })
                break
            case DIMENSION_TYPE_DATA_ELEMENT:
                message = i18n.t(
                    'No data elements found for "{{- searchTerm}}"',
                    {
                        searchTerm: searchTerm,
                    }
                )
                break
            case DIMENSION_TYPE_DATA_SET:
                message = i18n.t('No data sets found for "{{- searchTerm}}"', {
                    searchTerm: searchTerm,
                })
                break
            case DIMENSION_TYPE_EVENT_DATA_ITEM:
                message = i18n.t(
                    'No event data items found for "{{- searchTerm}}"',
                    {
                        searchTerm: searchTerm,
                    }
                )
                break
            case DIMENSION_TYPE_PROGRAM_INDICATOR:
                message = i18n.t(
                    'No program indicators found for "{{- searchTerm}}"',
                    {
                        searchTerm: searchTerm,
                    }
                )
                break
            default:
                message = i18n.t('Nothing found for "{{- searchTerm}}"', {
                    searchTerm: searchTerm,
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
            dataType: DIMENSION_TYPE_ALL,
        },
        options: [],
        loading: true,
        nextPage: 1,
    })
    const [calculationModalIsOpen, setCalculationModalIsOpen] = useState(false)
    const dataEngine = useDataEngine()
    const setSearchTerm = (searchTerm) =>
        setState((state) => ({ ...state, searchTerm }))
    const setFilter = (filter) => setState((state) => ({ ...state, filter }))
    const debouncedSearchTerm = useDebounce(state.searchTerm, 200)
    const fetchItems = async (page) => {
        setState((state) => ({ ...state, loading: true }))
        const result = await apiFetchOptions({
            dataEngine,
            nameProp: displayNameProp,
            page,
            filter: state.filter,
            searchTerm: state.searchTerm,
        })
        const newOptions = []
        result.dimensionItems?.forEach((item) => {
            if (item.dimensionItemType === REPORTING_RATE) {
                if (
                    state.filter.subGroup &&
                    state.filter.subGroup !== DIMENSION_TYPE_ALL
                ) {
                    const metric = DATA_SETS_CONSTANTS.find(
                        (item) => item.id === state.filter.subGroup
                    )
                    newOptions.push({
                        label: `${item.name} - ${metric.getName()}`,
                        value: `${item.id}.${metric.id}`,
                        disabled: item.disabled,
                        type: item.dimensionItemType,
                    })
                } else {
                    DATA_SETS_CONSTANTS.forEach((metric) => {
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
        setState((state) => ({
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
            newOptions.every((newOption) =>
                selectedItems.find(
                    (selectedItem) => selectedItem.value === newOption.value
                )
            )
        ) {
            fetchItems(result.nextPage)
        }
    }

    useDidUpdateEffect(() => {
        setState((state) => ({
            ...state,
            loading: true,
            nextPage: 1,
        }))
        fetchItems(1)
    }, [debouncedSearchTerm, state.filter])
    const onChange = (newSelected) => {
        onSelect(
            newSelected.map((value) => {
                const matchingItem = [...state.options, ...selectedItems].find(
                    (item) => item.value === value
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
    const isActive = (value) => {
        const item = selectedItems.find((item) => item.value === value)
        return !item || item.isActive
    }
    const getItemType = (value) =>
        [...state.options, ...selectedItems].find(
            (item) => item.value === value
        )?.type
    const getTooltipText = (itemType) => {
        switch (itemType) {
            case DIMENSION_TYPE_DATA_ELEMENT_OPERAND:
                return dataTypes[DIMENSION_TYPE_DATA_ELEMENT].getItemName()
            case REPORTING_RATE:
                return dataTypes[DIMENSION_TYPE_DATA_SET].getItemName()
            case DIMENSION_TYPE_PROGRAM_DATA_ELEMENT:
            case DIMENSION_TYPE_PROGRAM_ATTRIBUTE:
                return dataTypes[DIMENSION_TYPE_EVENT_DATA_ITEM].getItemName()
            default:
                return dataTypes[itemType]?.getItemName()
        }
    }
    const getIcon = (itemType) => {
        switch (itemType) {
            case DIMENSION_TYPE_INDICATOR:
                return <IconDimensionIndicator16 />
            case DIMENSION_TYPE_DATA_ELEMENT_OPERAND:
            case DIMENSION_TYPE_DATA_ELEMENT:
                return DataElementIcon
            case REPORTING_RATE:
                return <IconDimensionDataSet16 />
            case DIMENSION_TYPE_EVENT_DATA_ITEM:
            case DIMENSION_TYPE_PROGRAM_DATA_ELEMENT:
            case DIMENSION_TYPE_PROGRAM_ATTRIBUTE:
                return <IconDimensionEventDataItem16 />
            case DIMENSION_TYPE_PROGRAM_INDICATOR:
                return <IconDimensionProgramIndicator16 />
            case DIMENSION_TYPE_CALCULATION:
                return CalculationIcon
            default:
                return GenericIcon
        }
    }
    return (
        <>
            <Transfer
                onChange={({ selected }) => onChange(selected)}
                selected={selectedItems.map((item) => item.value)}
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
                        setDataType={(dataType) => {
                            setFilter({
                                ...state.filter,
                                dataType,
                                group: null,
                                subGroup:
                                    dataType === DIMENSION_TYPE_DATA_ELEMENT
                                        ? TOTALS
                                        : null,
                            })
                        }}
                        group={state.filter.group}
                        setGroup={(group) => {
                            setFilter({ ...state.filter, group })
                        }}
                        subGroup={state.filter.subGroup}
                        setSubGroup={(subGroup) => {
                            setFilter({ ...state.filter, subGroup })
                        }}
                        searchTerm={state.searchTerm}
                        setSearchTerm={setSearchTerm}
                        displayNameProp={displayNameProp}
                        dataTest={`${dataTest}-left-header`}
                    />
                }
                leftFooter={
                    <div className="calculation-button">
                        <Button
                            icon={<IconAdd24 />}
                            onClick={() => setCalculationModalIsOpen(true)}
                            small
                        >
                            {i18n.t('Calculation')}
                        </Button>
                    </div>
                }
                enableOrderChange
                height={TRANSFER_HEIGHT}
                optionsWidth={TRANSFER_OPTIONS_WIDTH}
                selectedWidth={TRANSFER_SELECTED_WIDTH}
                selectedEmptyComponent={<EmptySelection />}
                rightHeader={<RightHeader infoText={infoBoxMessage} />}
                rightFooter={rightFooter}
                renderOption={(props) => (
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
                        tooltipText={
                            state.filter.dataType === DIMENSION_TYPE_ALL
                                ? getTooltipText(
                                      getItemType(
                                          props.value /* eslint-disable-line react/prop-types */
                                      )
                                  )
                                : undefined
                        }
                        dataTest={`${dataTest}-transfer-option`}
                        onEditClick={
                            getItemType(
                                props.value /* eslint-disable-line react/prop-types */
                            ) === DIMENSION_TYPE_CALCULATION
                                ? () => alert('click!')
                                : undefined
                        }
                    />
                )}
                dataTest={`${dataTest}-transfer`}
            />
            {calculationModalIsOpen && (
                <Modal dataTest={`calculation-modal`} position="top" large>
                    <ModalTitle dataTest={'calculation-modal-title'}>
                        {i18n.t('Data')}
                    </ModalTitle>
                    <ModalContent dataTest={'calculation-modal-content'}>
                        <EditCalculation />
                    </ModalContent>
                    <ModalActions dataTest={'calculation-modal-actions'}>
                        <ButtonStrip>
                            <Button
                                onClick={() => setCalculationModalIsOpen(false)}
                            >
                                {i18n.t('Cancel')}
                            </Button>
                            <Button
                                primary
                                onClick={() => setCalculationModalIsOpen(false)}
                            >
                                {i18n.t('Save calculation')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
            <style jsx>{styles}</style>
        </>
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
