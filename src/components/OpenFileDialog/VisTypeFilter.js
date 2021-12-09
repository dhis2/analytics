import i18n from '@dhis2/d2-i18n'
import { Divider, SingleSelect, SingleSelectOption, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { visTypeDisplayNames } from '../../modules/visTypes.js'
import { VisTypeIcon } from '../VisTypeIcon.js'
import { CustomSelectOption } from './CustomSelectOption.js'

export const VIS_TYPE_ALL = 'all'
export const VIS_TYPE_CHARTS = 'charts'

export const VisTypeFilter = ({ selected, onChange }) => (
    <SingleSelect
        selected={selected}
        onChange={({ selected }) => onChange(selected)}
        prefix={i18n.t('Type')}
        dense
        maxHeight="400px"
    >
        {/* TODO figure out if this distinction still make sense since we have SV and potentially other new types in the future which might not fall into the chart/PT categories */}
        <SingleSelectOption label={i18n.t('All types')} value={VIS_TYPE_ALL} />
        <SingleSelectOption
            label={i18n.t('All charts')}
            value={VIS_TYPE_CHARTS}
        />
        <Divider />
        {Object.entries(visTypeDisplayNames).map(([type, label]) => (
            <CustomSelectOption
                key={type}
                label={label}
                value={type}
                icon={
                    <VisTypeIcon type={type} useSmall color={colors.grey600} />
                }
            />
        ))}
    </SingleSelect>
)

VisTypeFilter.propTypes = {
    selected: PropTypes.string,
    onChange: PropTypes.func,
}

export default VisTypeFilter
