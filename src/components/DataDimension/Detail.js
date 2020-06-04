import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import { TOTALS, DETAIL } from '../../modules/dataTypes'

import styles from './styles/Detail.style'

const getOptions = () => ({
    [TOTALS]: i18n.t('Totals'),
    [DETAIL]: i18n.t('Details'),
})

export const Detail = ({ currentValue, onChange }) => {
    const options = getOptions()
    const currentLabel = options[currentValue]
    return (
        <div className="detail-container">
            <SingleSelectField
                label={i18n.t('Detail')}
                selected={
                    currentLabel
                        ? {
                              value: currentValue,
                              label: currentLabel,
                          }
                        : null
                }
                onChange={ref => onChange(ref.selected.value)}
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
