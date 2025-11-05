import { useConfig } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, {
    createContext,
    useContext,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import {
    dataTypeMap,
    DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM,
} from '../../modules/dataTypes.js'
import { DIMENSION_ID_DATA } from '../../modules/predefinedDimensions.js'
import { InfoPopover } from './Info/InfoPopover.js'
import { ItemOptionsSelector } from './ItemOptionsSelector/ItemOptionsSelector.js'
import ItemSelector from './ItemSelector/ItemSelector.js'

const DataDimensionCtx = createContext({})

const SELECTED_DIMENSIONS_PROP_DEFAULT = []

const DataDimension = ({
    currentUser,
    onSelect = Function.prototype,
    selectedDimensions = SELECTED_DIMENSIONS_PROP_DEFAULT,
    displayNameProp,
    enabledDataTypes,
    infoBoxMessage,
    onCalculationSave,
    visType,
}) => {
    const { serverVersion } = useConfig()

    const itemsRef = useRef(new Map())

    const filterDataTypesByVersion = useCallback(
        (dataTypes) =>
            dataTypes.filter(
                ({ id }) =>
                    // Calculations only available from 2.40
                    id !== DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM ||
                    serverVersion.minor >= 40
            ),
        [serverVersion.minor]
    )

    const [dataTypes, setDataTypes] = useState(
        filterDataTypesByVersion(enabledDataTypes || Object.values(dataTypeMap))
    )
    const supportsEDI = dataTypes
        .map(({ id }) => id)
        .includes(DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM)

    const [currentCalculation, setCurrentCalculation] = useState()
    const [currentDataItem, setCurrentDataItem] = useState()
    const [infoDataItem, setInfoDataItem] = useState()
    const selectedItems = useMemo(
        () =>
            selectedDimensions.map((item) => ({
                value: item.id,
                label: item.name,
                isActive: item.isActive,
                type: item.type,
                optionSetId: item.optionSetId,
                expression: item.expression,
                access: item.access,
            })),
        [selectedDimensions]
    )

    const onSelectItems = (selectedItem) =>
        onSelect({
            dimensionId: DIMENSION_ID_DATA,
            items: selectedItem.map((item) => ({
                id: item.value,
                name: item.label,
                type: item.type,
                optionSetId: item.optionSetId,
                expression: item.expression,
            })),
        })

    useEffect(
        () =>
            enabledDataTypes &&
            setDataTypes(filterDataTypesByVersion(enabledDataTypes)),
        [enabledDataTypes, filterDataTypesByVersion]
    )

    const onEditClick = (dataItem) => {
        if (
            dataItem.type === DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM &&
            !(dataItem.access?.write === false) &&
            supportsEDI
        ) {
            // calculation
            setCurrentCalculation({
                id: dataItem.value,
                name: dataItem.label,
                expression: dataItem.expression,
            })
        } else if (dataItem.optionSetId) {
            setCurrentDataItem({
                id: dataItem.value,
                name: dataItem.label,
                type: dataItem.type,
                optionSetId: dataItem.optionSetId,
            })
        }
    }

    return (
        <DataDimensionCtx.Provider value={{ visType, currentUser }}>
            <ItemSelector
                selectedItems={selectedItems}
                onSelect={onSelectItems}
                displayNameProp={displayNameProp}
                infoBoxMessage={infoBoxMessage}
                dataTest={'data-dimension'}
                dataTypes={dataTypes}
                itemsRef={itemsRef}
                supportsEDI={supportsEDI}
                onEDISave={onCalculationSave}
                isOptionViewMode={Boolean(currentDataItem)}
                currentCalculation={currentCalculation}
                setCurrentCalculation={setCurrentCalculation}
                infoDataItem={infoDataItem}
                setInfoDataItem={setInfoDataItem}
                onEditClick={onEditClick}
            />
            {currentDataItem && (
                <ItemOptionsSelector
                    {...currentDataItem}
                    selectedItems={selectedItems}
                    onSelect={onSelectItems}
                    displayNameProp={displayNameProp}
                    dataTest={'data-dimension'}
                    itemsRef={itemsRef}
                    infoDataItem={infoDataItem}
                    setInfoDataItem={setInfoDataItem}
                    onClose={() => setCurrentDataItem()}
                    onEditClick={onEditClick}
                />
            )}
            {infoDataItem && (
                <InfoPopover
                    dataTest={'data-dimension-info'}
                    item={infoDataItem}
                    reference={itemsRef.current.get(infoDataItem.id)}
                    onClose={() => setInfoDataItem()}
                    displayNameProp={displayNameProp}
                />
            )}
        </DataDimensionCtx.Provider>
    )
}

DataDimension.propTypes = {
    displayNameProp: PropTypes.string.isRequired,
    selectedDimensions: PropTypes.arrayOf(
        PropTypes.shape({
            expression: PropTypes.string,
            id: PropTypes.string,
            isActive: PropTypes.bool,
            name: PropTypes.string,
            type: PropTypes.string,
        })
    ).isRequired,
    onSelect: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
    enabledDataTypes: PropTypes.array,
    infoBoxMessage: PropTypes.string,
    visType: PropTypes.string,
    onCalculationSave: PropTypes.func,
}

export const useDataDimensionContext = () => useContext(DataDimensionCtx)

export default DataDimension
