import { Popover } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { REPORTING_RATE } from '../../../modules/dataSets.js'
import {
    DIMENSION_TYPE_DATA_ELEMENT,
    //DIMENSION_TYPE_DATA_SET,
    DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM, // calculation
    DIMENSION_TYPE_INDICATOR,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE, // event data item
    DIMENSION_TYPE_PROGRAM_DATA_ELEMENT, // event data item
    DIMENSION_TYPE_PROGRAM_INDICATOR,
} from '../../../modules/dataTypes.js'
import { CalculationInfo } from './CalculationInfo.js'
import { DataElementInfo } from './DataElementInfo.js'
import { DataSetInfo } from './DataSetInfo.js'
import { EventDataItemInfo } from './EventDataItemInfo.js'
import { IndicatorInfo } from './IndicatorInfo.js'
import { ProgramIndicatorInfo } from './ProgramIndicatorInfo.js'
import styles from './styles/InfoPopover.style.js'

export const InfoPopover = ({ reference, onClose, ...props }) => {
    console.log('type', props.item.type, 'id', props.item.id)

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
            >
                <div className="popover">
                    {type === DIMENSION_TYPE_DATA_ELEMENT && (
                        <DataElementInfo {...infoProps} />
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
                </div>
            </Popover>
            <style jsx>{styles}</style>
        </>
    )
}

InfoPopover.propTypes = {
    displayNameProp: PropTypes.string,
    item: PropTypes.object,
    reference: PropTypes.object,
    onClose: PropTypes.func,
}
