import { IconChevronRight24, IconChevronLeft24 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import menuButtonStyles from './MenuButton.styles.js'

export const InterpretationsAndDetailsToggler = ({
    onClick,
    dataTest,
    disabled,
    isShowing,
}) => (
    <button onClick={onClick} disabled={disabled} data-test={dataTest}>
        {isShowing ? <IconChevronRight24 /> : <IconChevronLeft24 />}
        {i18n.t('Interpretations and details')}
        <style jsx>{menuButtonStyles}</style>
        <style jsx>{`
            button {
                gap: 8px;
            }
        `}</style>
    </button>
)

InterpretationsAndDetailsToggler.defaultProps = {
    dataTest: 'dhis2-analytics-interpretationsanddetailstoggler',
}

InterpretationsAndDetailsToggler.propTypes = {
    onClick: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
    disabled: PropTypes.bool,
    isShowing: PropTypes.bool,
}
