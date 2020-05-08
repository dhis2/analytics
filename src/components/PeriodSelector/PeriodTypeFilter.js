import React from 'react'
import PropTypes from 'prop-types'

import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import i18n from '@dhis2/d2-i18n'
import InputLabel from './InputLabel'

const PeriodTypeFilter = ({ options, onChange, value }) => {
    return (
        <FormControl>
            <InputLabel label={i18n.t('Period type')} />
            <Select
                onChange={onChange}
                value={value}
                inputProps={{ name: 'periodType', id: 'period-type' }}
                disableUnderline
            >
                {Object.entries(options).map(([key, val]) => (
                    <MenuItem value={key} key={key}>
                        {val.name()}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

PeriodTypeFilter.propTypes = {
    options: PropTypes.object.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func,
}

export default PeriodTypeFilter
