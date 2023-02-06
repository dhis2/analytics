import i18n from '@dhis2/d2-i18n'
import { SingleSelect, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    getDisplayNameByVisType,
    visTypeIcons,
} from '../../modules/visTypes.js'
import { VisTypeIcon } from '../VisTypeIcon.js'
import { CustomSelectOption } from './CustomSelectOption.js'

export const VisTypeFilter = ({ visTypes, selected, onChange }) => (
    <SingleSelect
        selected={selected}
        onChange={({ selected }) => onChange(selected)}
        prefix={i18n.t('Type')}
        dense
        maxHeight="400px"
    >
        {visTypes?.map(({ type, disabled, insertDivider }) => (
            <CustomSelectOption
                key={type}
                disabled={disabled}
                label={getDisplayNameByVisType(type)}
                insertDivider={insertDivider}
                value={type}
                icon={
                    visTypeIcons[type] ? (
                        <VisTypeIcon
                            type={type}
                            useSmall
                            color={colors.grey600}
                        />
                    ) : undefined
                }
            />
        ))}
    </SingleSelect>
)

VisTypeFilter.propTypes = {
    selected: PropTypes.string,
    visTypes: PropTypes.arrayOf(
        PropTypes.shape({
            disabled: PropTypes.bool,
            insertDivider: PropTypes.bool,
            type: PropTypes.string,
        })
    ),
    onChange: PropTypes.func,
}

export default VisTypeFilter
