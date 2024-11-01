import { CircularLoader } from '@dhis2-ui/loader'
import { colors } from '@dhis2/ui-constants'
import { IconSync16 } from '@dhis2/ui-icons'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import menuButtonStyles from './MenuButton.styles.js'

export const UpdateButton = ({ onClick, disabled, loading, dataTest }) => (
    <button onClick={onClick} disabled={disabled} data-test={dataTest}>
        {loading ? <CircularLoader extrasmall /> : <IconSync16 />}
        {i18n.t('Update')}
        <style jsx>{menuButtonStyles}</style>
        <style jsx>{`
            button {
                gap: 8px;
                color: ${colors.blue700};
                font-weight: 500;
            }
            button:hover:enabled {
                background: ${colors.blue100};
            }
            button:active {
                background: ${colors.blue200};
            }
        `}</style>
    </button>
)

UpdateButton.defaultProps = {
    dataTest: 'dhis2-analytics-updatebutton',
}

UpdateButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
}
