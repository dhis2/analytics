import { Popover } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { REPORTING_RATE } from '../../../modules/dataSets.js' // data sets
import {
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_DATA_ELEMENT_OPERAND,
    DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM, // calculation
    DIMENSION_TYPE_INDICATOR,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE, // event data items
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE_OPTION,
    DIMENSION_TYPE_PROGRAM_DATA_ELEMENT, // event data items
    DIMENSION_TYPE_PROGRAM_DATA_ELEMENT_OPTION,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
} from '../../../modules/dataTypes.js'
import { CalculationInfo } from './CalculationInfo.js'
import { DataElementInfo } from './DataElementInfo.js'
import { DataElementOperandInfo } from './DataElementOperandInfo.js'
import { DataSetInfo } from './DataSetInfo.js'
import { EventDataItemInfo } from './EventDataItemInfo.js'
import { IndicatorInfo } from './IndicatorInfo.js'
import { OptionInfo } from './OptionInfo.js'
import { ProgramIndicatorInfo } from './ProgramIndicatorInfo.js'
import styles from './styles/InfoPopover.style.js'

export const InfoPopover = ({ reference, onClose, dataTest, ...props }) => {
    const type = props.item.type

    const infoProps = {
        type,
        id: props.item.id,
        displayNameProp: props.displayNameProp,
    }

    return (
        <>
            <Popover
                placement="bottom-end"
                reference={reference}
                onClickOutside={onClose}
                maxWidth={480}
                arrow={false}
                elevation="rgba(0, 0, 0, 0.1) 0px 1px 5px, rgba(0, 0, 0, 0.07) 0px 3.6px 13px, rgba(0, 0, 0, 0.06) 0px 8.4px 23px, rgba(0, 0, 0, 0.05) 0px 23px 35px"
            >
                <div className="popover" data-test={`${dataTest}-table`}>
                    {type === DIMENSION_TYPE_DATA_ELEMENT && (
                        <DataElementInfo {...infoProps} />
                    )}
                    {type === DIMENSION_TYPE_DATA_ELEMENT_OPERAND && (
                        <DataElementOperandInfo {...infoProps} />
                    )}
                    {type === DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM && (
                        <CalculationInfo {...infoProps} />
                    )}
                    {type === REPORTING_RATE /* TODO: verify this! */ && (
                        <DataSetInfo {...infoProps} />
                    )}
                    {type === DIMENSION_TYPE_INDICATOR && (
                        <IndicatorInfo {...infoProps} />
                    )}
                    {[
                        DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
                        DIMENSION_TYPE_PROGRAM_DATA_ELEMENT,
                    ].includes(type) && <EventDataItemInfo {...infoProps} />}
                    {type === DIMENSION_TYPE_PROGRAM_INDICATOR && (
                        <ProgramIndicatorInfo {...infoProps} />
                    )}
                    {[
                        DIMENSION_TYPE_PROGRAM_DATA_ELEMENT_OPTION,
                        DIMENSION_TYPE_PROGRAM_ATTRIBUTE_OPTION,
                    ].includes(type) && <OptionInfo {...infoProps} />}
                </div>
            </Popover>
            <style jsx>{styles}</style>
        </>
    )
}

InfoPopover.propTypes = {
    displayNameProp: PropTypes.string.isRequired,
    item: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
    }).isRequired,
    dataTest: PropTypes.string,
    reference: PropTypes.object,
    onClose: PropTypes.func,
}
