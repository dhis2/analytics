import { useDataEngine } from '@dhis2/app-runtime'
import { Transfer, InputField, IconInfo16, Button, IconAdd24 } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { apiFetchOptions } from '../../../api/dimensions.js'
import i18n from '../../../locales/index.js'
import {
    DATA_SETS_CONSTANTS,
    REPORTING_RATE,
} from '../../../modules/dataSets.js'
import {
    DIMENSION_TYPE_ALL,
    DIMENSION_TYPE_DATA_ELEMENT,
    TOTALS,
    DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM,
} from '../../../modules/dataTypes.js'
import {
    getIcon,
    getDimensionType,
} from '../../../modules/dimensionListItem.jsx'
import {
    TRANSFER_HEIGHT,
    TRANSFER_OPTIONS_WIDTH,
    TRANSFER_SELECTED_WIDTH,
} from '../../../modules/dimensionSelectorHelper.js'
import { useDebounce, useDidUpdateEffect } from '../../../modules/utils.js'
import styles from '../../styles/DimensionSelector.style.js'
import CalculationModal from '../Calculation/CalculationModal.jsx'
import { SelectedEmptyPlaceholder } from '../SelectedEmptyPlaceholder.jsx'
import { SourceEmptyPlaceholder } from '../SourceEmptyPlaceholder.jsx'
import { TransferOption } from '../TransferOption.jsx'
import DataTypeSelector from './DataTypeSelector.jsx'
import GroupSelector from './GroupSelector.jsx'

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

const ItemSelector = ({
    selectedItems,
    noItemsMessage,
    onSelect,
    rightFooter,
    displayNameProp,
    infoBoxMessage,
    itemsRef,
    currentCalculation,
    setCurrentCalculation,
    infoDataItem,
    setInfoDataItem,
    dataTypes,
    dataTest,
    onEDISave,
    onEditClick,
    isOptionViewMode,
    supportsEDI,
}) => {
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
    })

    const debouncedSearchTerm = useDebounce(state.searchTerm, 500)
    const dataEngine = useDataEngine()

    const setSearchTerm = (searchTerm) =>
        setState((state) => ({ ...state, searchTerm }))

    const fetchItems = async (page) => {
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
                    optionSetId: item.optionSetId,
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
        fetchItems(1)
    }, [debouncedSearchTerm, state.filter]) // does this effect dep work?

    const onChange = (selectedIds) => {
        const newSelectedItems = selectedIds.map((id) => {
            const matchingItem = [...state.options, ...selectedItems].find(
                (item) => item.value === id
            )

            return {
                value: id,
                label: matchingItem.label,
                type: matchingItem.type,
                optionSetId: matchingItem.optionSetId,
                ...(matchingItem.expression
                    ? { expression: matchingItem.expression }
                    : {}),
            }
        })

        onSelect(newSelectedItems)
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

    return (
        <div className={cx('transfer-container', { hidden: isOptionViewMode })}>
            <Transfer
                onChange={({ selected }) => onChange(selected)}
                selected={selectedItems.map((item) => item.value)}
                options={[
                    ...state.options,
                    // remove items already in the options list
                    ...selectedItems.filter(
                        (selectedItem) =>
                            !state.options?.find(
                                (option) => option.value === selectedItem.value
                            )
                    ),
                ]}
                loading={state.loading}
                loadingPicked={state.loading}
                sourceEmptyPlaceholder={
                    <SourceEmptyPlaceholder
                        loading={state.loading}
                        searchTerm={debouncedSearchTerm}
                        options={state.options}
                        allItemsSelectedMessage={
                            state.options.length === selectedItems.length &&
                            !state.nextPage
                                ? i18n.t(
                                      'All available items are already selected'
                                  )
                                : ''
                        }
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
                    supportsEDI ? (
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
                selectedEmptyComponent={<SelectedEmptyPlaceholder />}
                rightHeader={<RightHeader infoBoxMessage={infoBoxMessage} />}
                rightFooter={rightFooter}
                renderOption={(props) => {
                    // console.log('renderOption', props)
                    return (
                        <TransferOption
                            /* eslint-disable react/prop-types */
                            {...props}
                            active={isActive(props.value)}
                            showingInfo={infoDataItem?.id === props.value}
                            icon={getIcon(props.type)}
                            dataItemType={props.type}
                            dimensionType={getDimensionType({
                                type: props.type,
                                expression: props.expression,
                            })}
                            dataTest={`${dataTest}-transfer-option`}
                            itemsRef={itemsRef}
                            onEditClick={() => onEditClick(props)}
                            onInfoClick={() =>
                                setInfoDataItem({
                                    id: props.value,
                                    type: props.type,
                                })
                            }
                            /* eslint-enable react/prop-types */
                        />
                    )
                }}
                dataTest={`${dataTest}-transfer`}
            />
            {currentCalculation && supportsEDI && (
                <CalculationModal
                    calculation={currentCalculation}
                    onSave={onSaveCalculation}
                    onClose={() => setCurrentCalculation()}
                    onDelete={onDeleteCalculation}
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
    currentCalculation: PropTypes.object,
    dataTest: PropTypes.string,
    dataTypes: PropTypes.array,
    infoBoxMessage: PropTypes.string,
    infoDataItem: PropTypes.object,
    isOptionViewMode: PropTypes.bool,
    itemsRef: PropTypes.object,
    noItemsMessage: PropTypes.string,
    rightFooter: PropTypes.node,
    selectedItems: PropTypes.arrayOf(
        PropTypes.exact({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
            access: PropTypes.object,
            isActive: PropTypes.bool,
            type: PropTypes.string,
            expression: PropTypes.string,
            optionSetId: PropTypes.string,
        })
    ),
    setCurrentCalculation: PropTypes.func,
    setInfoDataItem: PropTypes.func,
    supportsEDI: PropTypes.bool,
    onEDISave: PropTypes.func,
    onEditClick: PropTypes.func,
}

ItemSelector.defaultProps = {
    selectedItems: [],
}

export default ItemSelector
