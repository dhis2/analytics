import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import { TOTALS, DETAIL, ALL_ID } from '../../modules/dataTypes'

import styles from './styles/Detail.style'

const getOptions = () => ({
    [ALL_ID]: i18n.t('Totals & Details'),
    [TOTALS]: i18n.t('Totals only'),
    [DETAIL]: i18n.t('Details only'),
})

export const Detail = ({ currentValue, onChange }) => {
    const options = getOptions()
    return (
        <div className="detail-container">
            <SingleSelectField
                label={i18n.t('Disaggregation')}
                selected={currentValue}
                onChange={ref => onChange(ref.selected)}
                dense
            >
                {Object.entries(options).map(option => (
                    <SingleSelectOption
                        value={option[0]}
                        key={option[0]}
                        label={option[1]}
                    />
                ))}
            </SingleSelectField>
            <style jsx>{styles}</style>
        </div>
    )
}

Detail.propTypes = {
    currentValue: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default Detail
