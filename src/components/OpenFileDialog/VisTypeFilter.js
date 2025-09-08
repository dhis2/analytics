import i18n from '@dhis2/d2-i18n'
import { SingleSelect, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    getDisplayNameByVisType,
    visTypeIcons,
    VIS_TYPE_GROUP_ALL,
    VIS_TYPE_GROUP_CHARTS,
    VIS_TYPE_PIVOT_TABLE,
} from '../../modules/visTypes.js'
import { VisTypeIcon } from '../VisTypeIcon.js'
import { CustomSelectOption } from './CustomSelectOption.js'

export const formatTypeFilter = (filterVisTypes, visType) => {
    const defaultFilterTypes = []

    let defaultTypeFilter

    if (Array.isArray(filterVisTypes)) {
        defaultFilterTypes.push(
            ...filterVisTypes
                .filter(
                    ({ type, disabled }) =>
                        !(
                            disabled ||
                            [
                                VIS_TYPE_GROUP_ALL,
                                VIS_TYPE_GROUP_CHARTS,
                            ].includes(type)
                        )
                )
                .map(({ type }) => type)
        )

        if (defaultFilterTypes.length) {
            defaultTypeFilter = `type:in:[${defaultFilterTypes.join(',')}]`
        }
    }

    switch (visType) {
        case VIS_TYPE_GROUP_ALL: {
            return defaultTypeFilter
        }
        case VIS_TYPE_GROUP_CHARTS: {
            if (defaultFilterTypes.length) {
                return `type:in:[${defaultFilterTypes
                    .filter((item) => item !== VIS_TYPE_PIVOT_TABLE)
                    .join(',')}]`
            } else {
                return `type:!eq:${VIS_TYPE_PIVOT_TABLE}`
            }
        }
        default: {
            if (visType) {
                return `type:eq:${visType}`
            } else if (defaultTypeFilter) {
                return defaultTypeFilter
            }
        }
    }
}

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
