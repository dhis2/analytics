import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, ModalActions } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

export const TranslationModalActions = ({
    onClose,
    onSave,
    saveInProgress,
    saveButtonDisabled,
}) => (
    <ModalActions>
        <ButtonStrip>
            <Button secondary onClick={onClose}>
                {i18n.t('Cancel')}
            </Button>
            <Button
                primary
                onClick={onSave}
                loading={saveInProgress}
                disabled={saveButtonDisabled}
            >
                {i18n.t('Save translations')}
            </Button>
        </ButtonStrip>
    </ModalActions>
)

TranslationModalActions.propTypes = {
    onClose: PropTypes.func.isRequired,
    saveButtonDisabled: PropTypes.bool,
    saveInProgress: PropTypes.bool,
    onSave: PropTypes.func,
}
