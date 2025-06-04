import { Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../locales/index.js'
import { styles } from './styles/RecommendedIcon.style.js'

const RecommendedIcon = ({ isRecommended, dataTest }) =>
    isRecommended ? (
        <Tooltip
            content={i18n.t('Dimension recommended with selected data')}
            placement="bottom"
        >
            <div style={styles.recommendedIcon} data-test={dataTest} />
        </Tooltip>
    ) : null

RecommendedIcon.propTypes = {
    isRecommended: PropTypes.bool.isRequired,
    dataTest: PropTypes.string,
}

export default RecommendedIcon
