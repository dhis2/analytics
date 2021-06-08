import i18n from '@dhis2/d2-i18n'
import { Divider, SingleSelect, SingleSelectOption, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { visTypeDisplayNames } from '../../modules/visTypes'
import { VisTypeIcon } from '../VisTypeIcon'
import { CustomSelectOption } from './CustomSelectOption'

export const VisTypeFilter = ({ selected, onChange }) => (
    <SingleSelect
        selected={selected}
        onChange={({ selected }) => onChange(selected)}
        prefix={i18n.t('Type')}
        dense
    >
        <SingleSelectOption label={i18n.t('All types')} value="all" />
        <SingleSelectOption label={i18n.t('All charts')} value="chart" />
        <Divider />
        {Object.entries(visTypeDisplayNames).map(([type, label]) => (
            <CustomSelectOption
                key={type}
                label={label}
                value={type}
                icon={
                    <VisTypeIcon type={type} size={16} color={colors.grey600} />
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
