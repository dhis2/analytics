import { useDataEngine } from '@dhis2/app-runtime'
import { Transfer, InputField, IconInfo16, Button, IconAdd24 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { apiFetchOptions } from '../../api/dimensions.js'
import i18n from '../../locales/index.js'
import { DATA_SETS_CONSTANTS, REPORTING_RATE } from '../../modules/dataSets.js'
import {
    DIMENSION_TYPE_ALL,
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_DATA_SET,
    DIMENSION_TYPE_EVENT_DATA_ITEM,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
    DIMENSION_TYPE_INDICATOR,
    TOTALS,
    DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM,
} from '../../modules/dataTypes.js'
import { getIcon, getDimensionType } from '../../modules/dimensionListItem.js'
import {
    TRANSFER_HEIGHT,
    TRANSFER_OPTIONS_WIDTH,
    TRANSFER_SELECTED_WIDTH,
} from '../../modules/dimensionSelectorHelper.js'
import { useDebounce, useDidUpdateEffect } from '../../modules/utils.js'
import styles from '../styles/DimensionSelector.style.js'
import CalculationModal from './Calculation/CalculationModal.js'
import DataTypeSelector from './DataTypeSelector.js'
import GroupSelector from './GroupSelector.js'
import { InfoPopover } from './Info/InfoPopover.js'
import { TransferOption } from './TransferOption.js'

const LeftHeader = ({
    searchTerm,
    setSearchTerm,
    dataType,
    dataTypes,
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
                dataTypes={dataTypes}
            />
            {![
                DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM,
                DIMENSION_TYPE_ALL,
            ].includes(dataType) && (
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
    dataTypes: PropTypes.array,
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

const RightHeader = ({ infoBoxMessage }) => (
    <>
        <p className="rightHeader">{i18n.t('Selected Items')}</p>
        {infoBoxMessage && (
            <div className="info-container">
                <div>
                    <IconInfo16 />
                </div>
                <span className="info-text">{infoBoxMessage}</span>
            </div>
        )}
        <style jsx>{styles}</style>
    </>
)

RightHeader.propTypes = {
    infoBoxMessage: PropTypes.string,
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
                case DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM:
                    message = i18n.t('No calculations found')
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
                    searchTerm,
                })
                break
            case DIMENSION_TYPE_DATA_ELEMENT:
                message = i18n.t(
                    'No data elements found for "{{- searchTerm}}"',
                    {
                        searchTerm,
                    }
                )
                break
            case DIMENSION_TYPE_DATA_SET:
                message = i18n.t('No data sets found for "{{- searchTerm}}"', {
                    searchTerm,
                })
                break
            case DIMENSION_TYPE_EVENT_DATA_ITEM:
                message = i18n.t(
                    'No event data items found for "{{- searchTerm}}"',
                    { searchTerm }
                )
                break
            case DIMENSION_TYPE_PROGRAM_INDICATOR:
                message = i18n.t(
                    'No program indicators found for "{{- searchTerm}}"',
                    { searchTerm }
                )
                break
            case DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM:
                message = i18n.t(
                    'No calculations found for "{{- searchTerm}}"',
                    { searchTerm }
                )
                break
            default:
                message = i18n.t('Nothing found for "{{- searchTerm}}"', {
                    searchTerm,
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
    dataTypes,
    dataTest,
    onEDISave,
}) => {
    const itemsRef = useRef(new Map())

    const [state, setState] = useState({
        searchTerm: '',
        dataTypes,
        filter: {
            dataType:
                dataTypes.length === 1 ? dataTypes[0].id : DIMENSION_TYPE_ALL,
            group: null,
            subGroup:
                dataTypes.length === 1 &&
                dataTypes[0].id === DIMENSION_TYPE_DATA_ELEMENT
                    ? TOTALS
                    : null,
        },
        options: [],
        loading: true,
        nextPage: 1,
        supportsEDI: dataTypes
            .map(({ id }) => id)
            .includes(DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM),
    })
    const [currentCalculation, setCurrentCalculation] = useState()
    const [currentDataItem, setCurrentDataItem] = useState()

    const debouncedSearchTerm = useDebounce(state.searchTerm, 500)
    const dataEngine = useDataEngine()

    const setSearchTerm = (searchTerm) =>
        setState((state) => ({ ...state, searchTerm }))

    const fetchItems = async (page) => {
        console.log('jj fetchItems fn', { page, state })
        setState((state) => ({
            ...state,
            nextPage: page === 1 ? 1 : state.nextPage,
            loading: true,
        }))
        const result = await apiFetchOptions({
            dataEngine,
            nameProp: displayNameProp,
            page,
            filter: state.filter,
            searchTerm: state.searchTerm,
        })
        console.log('jj fetchItems result', result)
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
                        expression: item.expression,
                    })
                } else {
                    DATA_SETS_CONSTANTS.forEach((metric) => {
                        newOptions.push({
                            label: `${item.name} - ${metric.getName()}`,
                            value: `${item.id}.${metric.id}`,
                            disabled: item.disabled,
                            type: item.dimensionItemType,
                            expression: item.expression,
                        })
                    })
                }
            } else {
                newOptions.push({
                    label: item.name,
                    value: item.id,
                    disabled: item.disabled,
                    type: item.dimensionItemType,
                    expression: item.expression,
                })
            }
        })
        console.log('jj now setState with newOptions', {
            newOptions,
            np: result.nextPage,
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
            console.log(
                'jj fetchItems in very special case with page',
                result.nextPage
            )
            fetchItems(result.nextPage)
        }
    }

    useDidUpdateEffect(() => {
        console.log('jj useDidUpdateEffect fetchItems 1')
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
                    ...(matchingItem.expression
                        ? { expression: matchingItem.expression }
                        : {}),
                }
            })
        )
    }
    const onEndReached = () => {
        console.log('jj onEndReached', state.nextPage)
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

    const onSaveCalculation = async ({ id, name, expression, isNew }) => {
        onEDISave({
            id,
            name,
            expression,
            type: DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM,
        })

        // close the modal
        setCurrentCalculation()

        // reload the list of options
        console.log('jj onSaveCalc')
        fetchItems(1)

        if (isNew) {
            // select the new calculation
            onSelect([
                ...selectedItems,
                {
                    value: id,
                    label: name,
                    expression,
                    type: DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM,
                },
            ])
        }
    }

    const onDeleteCalculation = ({ id }) => {
        // close the modal
        setCurrentCalculation()

        // reload the list of options
        console.log('jj onDeleteCalc')
        fetchItems(1)

        // unselect the deleted calculation
        onSelect([...selectedItems.filter((item) => item.value !== id)])
    }

    const onSetGroup = (group) =>
        setState((state) => ({
            ...state,
            nextPage: 1,
            filter: {
                ...state.filter,
                group,
            },
        }))

    const onSetSubGroup = (subGroup) =>
        setState((state) => ({
            ...state,
            nextPage: 1,
            filter: {
                ...state.filter,
                subGroup,
            },
        }))

    const onSetDataType = (dataType) =>
        setState((state) => ({
            ...state,
            nextPage: 1,
            filter: {
                ...state.filter,
                dataType,
                group: null,
                subGroup:
                    dataType === DIMENSION_TYPE_DATA_ELEMENT ? TOTALS : null,
            },
        }))

    console.log('jj render transfer component with state', state)

    return (
        <div className="transfer-container">
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
                        dataTypes={state.dataTypes}
                        dataType={state.filter.dataType}
                        setDataType={onSetDataType}
                        group={state.filter.group}
                        setGroup={onSetGroup}
                        subGroup={state.filter.subGroup}
                        setSubGroup={onSetSubGroup}
                        searchTerm={state.searchTerm}
                        setSearchTerm={setSearchTerm}
                        displayNameProp={displayNameProp}
                        dataTest={`${dataTest}-left-header`}
                    />
                }
                leftFooter={
                    state.supportsEDI ? (
                        <div className="calculation-button">
                            <Button
                                icon={<IconAdd24 />}
                                onClick={() => setCurrentCalculation({})}
                                small
                            >
                                {i18n.t('Calculation')}
                            </Button>
                        </div>
                    ) : undefined
                }
                enableOrderChange
                height={TRANSFER_HEIGHT}
                optionsWidth={TRANSFER_OPTIONS_WIDTH}
                selectedWidth={TRANSFER_SELECTED_WIDTH}
                selectedEmptyComponent={<EmptySelection />}
                rightHeader={<RightHeader infoBoxMessage={infoBoxMessage} />}
                rightFooter={rightFooter}
                renderOption={(props) => (
                    <TransferOption
                        /* eslint-disable react/prop-types */
                        {...props}
                        active={isActive(props.value)}
                        showingInfo={currentDataItem?.id === props.value}
                        icon={getIcon(getItemType(props.value))}
                        dimensionType={getDimensionType({
                            type: getItemType(props.value),
                            expression: props.expression,
                        })}
                        dataTest={`${dataTest}-transfer-option`}
                        itemsRef={itemsRef}
                        onEditClick={
                            getItemType(props.value) ===
                                DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM &&
                            !(props.access?.write === false) &&
                            state.supportsEDI
                                ? () =>
                                      setCurrentCalculation({
                                          id: props.value,
                                          name: props.label,
                                          expression: props.expression,
                                      })
                                : undefined
                        }
                        onInfoClick={() =>
                            setCurrentDataItem({
                                id: props.value,
                                type: getItemType(props.value),
                            })
                        }
                        /* eslint-enable react/prop-types */
                    />
                )}
                dataTest={`${dataTest}-transfer`}
            />
            {currentCalculation && state.supportsEDI && (
                <CalculationModal
                    calculation={currentCalculation}
                    onSave={onSaveCalculation}
                    onClose={() => setCurrentCalculation()}
                    onDelete={onDeleteCalculation}
                    displayNameProp={displayNameProp}
                />
            )}
            {currentDataItem && (
                <InfoPopover
                    dataTest={`${dataTest}-info`}
                    item={currentDataItem}
                    reference={itemsRef.current.get(currentDataItem.id)}
                    onClose={() => setCurrentDataItem()}
                    displayNameProp={displayNameProp}
                />
            )}
            <style jsx>{styles}</style>
        </div>
    )
}

ItemSelector.propTypes = {
    displayNameProp: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
    dataTypes: PropTypes.array,
    infoBoxMessage: PropTypes.string,
    noItemsMessage: PropTypes.string,
    rightFooter: PropTypes.node,
    selectedItems: PropTypes.arrayOf(
        PropTypes.exact({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
            isActive: PropTypes.bool,
            type: PropTypes.string,
            expression: PropTypes.string,
        })
    ),
    onEDISave: PropTypes.func,
}

ItemSelector.defaultProps = {
    selectedItems: [],
}

export default ItemSelector
