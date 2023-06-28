import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, ModalActions } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { OfflineTooltip } from '../../OfflineTooltip.js'

const SaveButton = ({ disabled, loading, onClick }) => (
    <Button primary onClick={onClick} loading={loading} disabled={disabled}>
        {i18n.t('Save translations')}
    </Button>
)

SaveButton.defaultProps = {
    disabled: false,
    loading: false,
    onClick: Function.prototype,
}

SaveButton.propTypes = {
    disabled: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
}

export const TranslationModalActions = ({
    onClose,
    onSave,
    saveInProgress,
    saveButtonDisabled,
}) => {
    const { isDisconnected: offline } = useDhis2ConnectionStatus()

    return (
        <ModalActions>
            <ButtonStrip>
                <Button secondary onClick={onClose}>
                    {i18n.t('Cancel')}
                </Button>
                {offline ? (
                    <OfflineTooltip
                        content={i18n.t('Cannot save while offline')}
                    >
                        <SaveButton disabled={true} />
                    </OfflineTooltip>
                ) : (
                    <SaveButton
                        onClick={onSave}
                        loading={saveInProgress}
                        disabled={saveButtonDisabled}
                    />
                )}
            </ButtonStrip>
        </ModalActions>
    )
}

TranslationModalActions.propTypes = {
    onClose: PropTypes.func.isRequired,
    saveButtonDisabled: PropTypes.bool,
    saveInProgress: PropTypes.bool,
    onSave: PropTypes.func,
}
