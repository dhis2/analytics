import i18n from '@dhis2/d2-i18n'
import {
    IconDimensionDataSet16,
    IconDimensionIndicator16,
    IconDimensionEventDataItem16,
    IconDimensionProgramIndicator16,
} from '@dhis2/ui'
import React from 'react'
import DataElementIcon from '../assets/DimensionItemIcons/DataElementIcon.jsx'
import GenericIcon from '../assets/DimensionItemIcons/GenericIcon.jsx'
import CalculationIcon from './../assets/DimensionItemIcons/CalculationIcon.jsx'
import { REPORTING_RATE } from './dataSets.js'
import {
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_DATA_ELEMENT_OPERAND,
    DIMENSION_TYPE_DATA_SET,
    DIMENSION_TYPE_EVENT_DATA_ITEM,
    DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    DIMENSION_TYPE_PROGRAM_DATA_ELEMENT,
    dataTypeMap as dataTypes,
    DIMENSION_TYPE_INDICATOR,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE_OPTION,
    DIMENSION_TYPE_PROGRAM_DATA_ELEMENT_OPTION,
} from './dataTypes.js'

export const getDimensionType = ({ type, expression }) => {
    if (type === DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM && expression) {
        return dataTypes[DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM].getItemName()
    }
    switch (type) {
        case DIMENSION_TYPE_DATA_ELEMENT_OPERAND:
            return dataTypes[DIMENSION_TYPE_DATA_ELEMENT].getItemName()
        case REPORTING_RATE:
            return dataTypes[DIMENSION_TYPE_DATA_SET].getItemName()
        case DIMENSION_TYPE_PROGRAM_DATA_ELEMENT:
        case DIMENSION_TYPE_PROGRAM_ATTRIBUTE:
            return dataTypes[DIMENSION_TYPE_EVENT_DATA_ITEM].getItemName()
        case DIMENSION_TYPE_PROGRAM_ATTRIBUTE_OPTION:
        case DIMENSION_TYPE_PROGRAM_DATA_ELEMENT_OPTION:
            return i18n.t('Option')
        default:
            return dataTypes[type]?.getItemName()
    }
}
export const getIcon = (type) => {
    switch (type) {
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
        case DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM:
            return CalculationIcon
        default:
            return GenericIcon
    }
}
