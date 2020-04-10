import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui-core'

import styles from './styles/Details.module.css'

export const Detail = ({ current, onDetailChange, detailAlternatives }) => {
    const currentValue = detailAlternatives[current]
    return (
        <div style={styles.detailContainer}>
            <SingleSelectField
                label={i18n.t('Detail')}
                selected={
                    currentValue
                        ? {
                              value: current,
                              label: currentValue,
                          }
                        : null
                }
                onChange={ref => onDetailChange(ref.selected.value)}
                dense
            >
                {Object.entries(detailAlternatives).map(item => (
                    <SingleSelectOption
                        value={item[0]}
                        key={item[0]}
                        label={item[1]}
                    />
                ))}
            </SingleSelectField>
        </div>
    )
}

Detail.propTypes = {
    current: PropTypes.string.isRequired,
    detailAlternatives: PropTypes.object.isRequired,
    onDetailChange: PropTypes.func.isRequired,
}

export default Detail
