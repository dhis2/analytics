import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import { TOTALS, DETAIL } from '../../modules/dataTypes'
import styles from './styles/DetailSelector.style'

const getOptions = () => ({
    [TOTALS]: i18n.t('Totals only'),
    [DETAIL]: i18n.t('Details only'),
})

export const DetailSelector = ({ currentValue, onChange, dataTest }) => {
    const options = getOptions()
    return (
        <div className="detail-container">
            <SingleSelectField
                dataTest={dataTest}
                label={i18n.t('Disaggregation')}
                selected={currentValue}
                onChange={(ref) => onChange(ref.selected)}
                dense
            >
                {Object.entries(options).map((option) => (
                    <SingleSelectOption
                        value={option[0]}
                        key={option[0]}
                        label={option[1]}
                        dataTest={`${dataTest}-option-${option[0]}`}
                    />
                ))}
            </SingleSelectField>
            <style jsx>{styles}</style>
        </div>
    )
}

DetailSelector.propTypes = {
    currentValue: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
}

export default DetailSelector
