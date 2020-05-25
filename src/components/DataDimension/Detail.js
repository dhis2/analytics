import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { TOTALS, DETAIL } from '../../modules/dataTypes'

import { styles } from './styles/Details.style'

const getOptions = () => ({
    [TOTALS]: i18n.t('Totals'),
    [DETAIL]: i18n.t('Details'),
})

export const Detail = ({ value, onChange }) => (
    <div style={styles.detailContainer}>
        <InputLabel style={styles.titleText}>{i18n.t('Detail')}</InputLabel>
        <Select
            onChange={event => onChange(event.target.value)}
            value={value}
            disableUnderline
            SelectDisplayProps={{ style: styles.dropDown }}
        >
            {Object.entries(getOptions()).map(([key, name]) => (
                <MenuItem key={key} value={key}>
                    {name}
                </MenuItem>
            ))}
        </Select>
    </div>
)

Detail.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default Detail
