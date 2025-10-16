import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { IconDelete16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useDeleteInterpretation } from '../../InterpretationsProvider/hooks.js'
import { MessageIconButton } from '../index.js'

const InterpretationDeleteButton = ({ id, onComplete }) => {
    const { show: showErrorAlert } = useAlert(
        i18n.t('Could not delete interpretation'),
        { critical: true }
    )
    const [remove, { loading }] = useDeleteInterpretation({
        id,
        onComplete,
        showErrorAlert,
    })

    return (
        <MessageIconButton
            tooltipContent={i18n.t('Delete')}
            iconComponent={IconDelete16}
            onClick={remove}
            disabled={loading}
            dataTest="interpretation-delete-button"
        />
    )
}

InterpretationDeleteButton.propTypes = {
    id: PropTypes.string.isRequired,
    onComplete: PropTypes.func,
}

export { InterpretationDeleteButton }
