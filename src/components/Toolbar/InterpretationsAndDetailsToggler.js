import i18n from '@dhis2/d2-i18n'
import { IconChevronRight24, IconChevronLeft24 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import menuButtonStyles from './MenuButton.styles.js'

export const InterpretationsAndDetailsToggler = ({
    onClick,
    disabled,
    isShowing,
}) => (
    <button onClick={onClick} disabled={disabled}>
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

InterpretationsAndDetailsToggler.propTypes = {
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    isShowing: PropTypes.bool,
}
